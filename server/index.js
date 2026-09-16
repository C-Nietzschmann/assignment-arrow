/* ============================================================================
   OPTIONAL question generator for Assignment Arrow.

   The app does NOT need this. Deployed as a Render Static Site it works
   completely: the course, 98 questions, the library, exam mode, the
   interpreter and saved progress are all client-side.

   Run this instead only if you want students to generate unlimited fresh
   questions. It serves the same static files AND exposes POST /api/generate.
   With no ANTHROPIC_API_KEY set it still serves the site and simply reports
   that generation is unavailable, so it is safe to deploy either way.
   ========================================================================== */
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PORT) || 10000;
const KEY  = (process.env.ANTHROPIC_API_KEY || "").trim();
const CODE = (process.env.SCHOOL_ACCESS_CODE || "").trim();
const MODEL = (process.env.ANTHROPIC_MODEL || "claude-opus-5").trim();
const PER_HOUR = Number(process.env.RATE_LIMIT_PER_HOUR) || 15;
const DAILY_CAP = Number(process.env.DAILY_QUESTION_CAP) || 300;

let anthropic = null;
if (KEY){
  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    anthropic = new Anthropic();          // reads ANTHROPIC_API_KEY
    console.log("Question generation is ON, using " + MODEL);
  } catch (e) {
    console.warn("ANTHROPIC_API_KEY is set but the SDK failed to load - " +
                 "run `npm install` in server/. Generation stays off.");
  }
} else {
  console.log("No ANTHROPIC_API_KEY set - serving the site only. This is fine.");
}

/* ---- spend guards ------------------------------------------------------- */
const hits = new Map();                    // ip -> [timestamps]
let dayKey = new Date().toISOString().slice(0, 10);
let dayCount = 0;

function allowed(ip){
  const today = new Date().toISOString().slice(0, 10);
  if (today !== dayKey){ dayKey = today; dayCount = 0; }
  if (dayCount >= DAILY_CAP) return "The class has reached today's question limit. It resets at midnight UTC.";
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < 3600000);
  if (recent.length >= PER_HOUR) return "You have generated " + PER_HOUR + " questions this hour. Try again later, or work through the built-in bank.";
  recent.push(now);
  hits.set(ip, recent);
  dayCount++;
  return null;
}

/* ---- static files ------------------------------------------------------- */
const TYPES = { ".html":"text/html; charset=utf-8", ".js":"text/javascript; charset=utf-8",
                ".css":"text/css; charset=utf-8", ".json":"application/json; charset=utf-8",
                ".svg":"image/svg+xml", ".ico":"image/x-icon", ".txt":"text/plain; charset=utf-8" };

async function serveStatic(req, res){
  let rel = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (rel === "/") rel = "/index.html";
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT)){ res.writeHead(403).end("Forbidden"); return; }
  try {
    const body = await fs.readFile(file);
    res.writeHead(200, {
      "Content-Type": TYPES[path.extname(file)] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff"
    }).end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
  }
}

function readJson(req){
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", c => {
      raw += c;
      if (raw.length > 20000) reject(new Error("too large"));
    });
    req.on("end", () => { try { resolve(JSON.parse(raw || "{}")); } catch(e){ reject(e); } });
    req.on("error", reject);
  });
}
const send = (res, code, obj) =>
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" }).end(JSON.stringify(obj));

/* ---- the generator ------------------------------------------------------ */
async function generate(req, res){
  if (!anthropic) return send(res, 503, { error: "Question generation is not switched on for this site." });

  let body;
  try { body = await readJson(req); }
  catch { return send(res, 400, { error: "Could not read that request." }); }

  if (CODE && String(body.code || "").trim() !== CODE)
    return send(res, 401, { error: "That access code is not right. Ask your teacher for it." });

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
             req.socket.remoteAddress || "unknown";
  const blocked = allowed(ip);
  if (blocked) return send(res, 429, { error: blocked });

  try {
    const msg = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 8000,
      thinking: { type: "adaptive" },
      messages: [{ role: "user", content: String(body.prompt || "").slice(0, 12000) }]
    });
    if (msg.stop_reason === "refusal")
      return send(res, 502, { error: "That request could not be answered. Try a different topic." });
    const text = msg.content.filter(b => b.type === "text").map(b => b.text).join("");
    send(res, 200, { text });
  } catch (e) {
    const status = e && e.status;
    if (status === 429) return send(res, 429, { error: "The service is busy. Wait a moment and try again." });
    if (status === 401) return send(res, 503, { error: "The site's API key is not valid. Tell your teacher." });
    console.error("generate failed:", e && e.message);
    send(res, 502, { error: "Could not generate a question just now. The built-in bank still works." });
  }
}

/* ---- server ------------------------------------------------------------- */
http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/api/status")
    return send(res, 200, { generation: !!anthropic, needsCode: !!CODE });
  if (url.pathname === "/api/generate"){
    if (req.method !== "POST") return send(res, 405, { error: "POST only" });
    return generate(req, res);
  }
  if (req.method !== "GET") return send(res, 405, { error: "GET only" });
  serveStatic(req, res);
}).listen(PORT, () => console.log("Assignment Arrow on http://localhost:" + PORT));
