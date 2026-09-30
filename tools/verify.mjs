#!/usr/bin/env node
/* ============================================================================
   ASSIGNMENT ARROW - VERIFIER
   Runs every model answer in the question bank and every example in the
   library through the real interpreter. Nothing ships unless this is green.
   Usage:  node tools/verify.mjs
   ========================================================================== */
import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const require = createRequire(import.meta.url);
require(path.join(root, "interpreter.js"));
require(path.join(root, "bank.js"));
require(path.join(root, "bank-igcse.js"));
require(path.join(root, "bank-extra.js"));
require(path.join(root, "library.js"));
require(path.join(root, "lessons.js"));
require(path.join(root, "lessons-igcse.js"));
require(path.join(root, "tests.js"));
require(path.join(root, "marking.js"));

const { PseudoRun, ArrowMarking } = globalThis;
const RED = "\x1b[31m", GRN = "\x1b[32m", DIM = "\x1b[2m", OFF = "\x1b[0m";

let pass = 0;
const failures = [];
function fail(where, detail){ failures.push({ where, detail }); }

/* ---------- 1. every question's model answer must run ---------- */
const QUESTIONS = (globalThis.QUESTIONS_ALEVEL || []).concat(globalThis.QUESTIONS_IGCSE || [], globalThis.QUESTIONS_EXTRA || []);
const RUNSPECS  = Object.assign({}, globalThis.RUNSPECS_ALEVEL || {}, globalThis.RUNSPECS_IGCSE || {});
const DIFF      = Object.assign({}, globalThis.DIFFICULTY_ALEVEL || {}, globalThis.DIFFICULTY_IGCSE || {});
Object.keys(RUNSPECS).forEach(id => {
  const q = QUESTIONS.find(x => x.id === id);
  if (q) q.run = RUNSPECS[id];
  else fail("runspec " + id, "no question with this id");
});

function runSrc(src, spec, level){
  spec = spec || {};
  const setup   = spec.setup   ? spec.setup + "\n" : "";
  const harness = spec.harness ? "\n" + spec.harness : "";
  const lines = String(spec.inputs || "").replace(/\r/g, "").split("\n");
  while (lines.length && lines[lines.length - 1] === "") lines.pop();
  return PseudoRun(setup + src + harness, {
    inputs: lines, files: spec.files, level: level || null,
    offset: setup ? setup.split("\n").length - 1 : 0
  });
}

const seenIds = new Set();
for (const q of QUESTIONS){
  if (seenIds.has(q.id)) fail("question " + q.id, "duplicate id");
  seenIds.add(q.id);

  if (!q.level)  fail("question " + q.id, "no level tag");
  if (!DIFF[q.id] && !q.diff) fail("question " + q.id, "no difficulty rating");
  if (!q.title || !q.stem) fail("question " + q.id, "missing title or stem");
  if (!Array.isArray(q.tips) || q.tips.length !== 3)
    fail("question " + q.id, "expected 3 tips, found " + (q.tips ? q.tips.length : 0));

  if (q.kind === "mcq"){
    if (!Array.isArray(q.options) || q.options.length < 2) fail("question " + q.id, "mcq needs options");
    else if (!(q.correct >= 0 && q.correct < q.options.length)) fail("question " + q.id, "mcq correct index out of range");
    else if (!q.explain) fail("question " + q.id, "mcq has no explanation");
    else pass++;
    continue;
  }

  if (q.kind === "trace"){
    if (!Array.isArray(q.cols) || !Array.isArray(q.rows)) { fail("question " + q.id, "trace needs cols and rows"); continue; }
    const bad = q.rows.find(r => r.length !== q.cols.length);
    if (bad) fail("question " + q.id, "a trace row has " + bad.length + " cells but there are " + q.cols.length + " columns");
    else if (q.stemCode){
      const r = runSrc(q.stemCode, q.run, q.level);
      if (!r.ok) fail("question " + q.id, "the traced algorithm does not run: L" + r.error.line + " " + r.error.msg);
      else pass++;
    } else pass++;
    continue;
  }

  const total = (q.ms || []).reduce((a, p) => a + (Number(p.m) || 0), 0);
  if (!q.ms || !q.ms.length) fail("question " + q.id, "no mark scheme");
  else if (total !== q.marks) fail("question " + q.id, "mark scheme sums to " + total + " but the question is worth " + q.marks);

  if (!q.model){ fail("question " + q.id, "no model answer"); continue; }
  const r = runSrc(q.model, q.run, q.level);
  if (!r.ok) fail("question " + q.id, "model answer does not run: L" + r.error.line + " " + r.error.msg);
  else pass++;
}

/* ---------- 2. every library example must produce its stated output ------- */
for (const group of (globalThis.LIBRARY || [])){
  for (const e of group.entries){
    const where = "library " + group.group + " / " + e.name;
    if (!e.levels || !e.levels.length) fail(where, "no levels");
    if (!e.what) fail(where, "no description");
    if (!e.ex){ fail(where, "no example"); continue; }
    const r = runSrc(e.ex, { inputs: e.inputs, files: e.files }, null);
    if (!r.ok){ fail(where, "example does not run: L" + r.error.line + " " + r.error.msg); continue; }
    const got = r.output.join("\n");
    if (e.out === undefined) fail(where, "no expected output; it printed " + JSON.stringify(got));
    else if (got !== e.out) fail(where, "expected " + JSON.stringify(e.out) + " but got " + JSON.stringify(got));
    else pass++;
  }
}

/* ---------- 3. snippets are fragments, so only sanity-check the shape ----- */
for (const s of (globalThis.SNIPPETS || [])){
  if (!s.name || !s.code) fail("snippet " + (s.name || "?"), "missing name or code");
  else pass++;
}

/* ---------- 4. lesson check questions that ship code must run ------------- */
const LESSONS = (globalThis.LESSONS_ALEVEL || []).concat(globalThis.LESSONS_IGCSE || []);
for (const L of LESSONS){
  if (!L.levels || !L.levels.length) fail("lesson " + L.id, "no levels tag");
  for (const b of L.blocks){
    if (b.t === "check" && b.acode){
      const r = runSrc(b.acode, b.run, null);
      if (!r.ok && !b.fragment) fail("lesson " + L.id + " check answer", "L" + r.error.line + " " + r.error.msg);
      else pass++;
    }
  }
}

/* ---------- 5. fair marking: wording is forgiven, values and meaning are not ---------- */
const SAME = [
  ["Enter a number of seconds: \n1 hour(s) 2 minute(s) 5 secound(s)", "Enter a number of seconds: \n1 hour(s) 2 minute(s) 5 second(s)", "a spelling slip"],
  ["How many seconds?\n1 hours 2 minutes 5 seconds", "Enter a number of seconds: \n1 hour(s) 2 minute(s) 5 second(s)", "another prompt, other wording"],
  ["1 hour(s) 2 minute(s) 5 second(s)", "Enter a number of seconds: \n1 hour(s) 2 minute(s) 5 second(s)", "no prompt at all"],
  ["Charge: 3.50", "Charge: 3.5", "3.50 is 3.5"],
  ["Parcel refused - to heavy", "Parcel refused - too heavy", "to / too"],
  ["The colour is grey", "Colour: grey", "words of your own on top"],
];
const DIFFERENT = [
  ["Valid", "Invalid", "valid is not invalid"], ["Invalid", "Valid", "invalid is not valid"],
  ["5 is odd", "5 is even", "odd is not even"], ["Record 5 found", "Record 5 not found", "a missing NOT"],
  ["Record 5 not found", "Record 5 found", "an extra NOT"], ["Pass", "Fail", "pass is not fail"],
  ["Weekday", "Weekend", "weekday is not weekend"], ["Found: FALSE", "Found: TRUE", "TRUE is not FALSE"],
  ["1 hour(s) 2 minute(s) 6 second(s)", "1 hour(s) 2 minute(s) 5 second(s)", "a wrong number"],
  ["1 hour(s) 2 minute(s)", "1 hour(s) 2 minute(s) 5 second(s)", "a missing number"],
  ["Charge: 6.75\nThank you", "Charge: 6.75", "an extra line"], [null, "Charge: 6.75", "it did not run"],
];
for (const [got, want, what] of SAME){
  if (ArrowMarking.sameOutput(got, want).ok) pass++; else fail("marking", "should pass (" + what + "): " + JSON.stringify(got) + " for " + JSON.stringify(want));
}
for (const [got, want, what] of DIFFERENT){
  if (!ArrowMarking.sameOutput(got, want).ok) pass++; else fail("marking", "should fail (" + what + "): " + JSON.stringify(got) + " for " + JSON.stringify(want));
}
/* two hidden cases of one question must never pass for each other: printing one
   case's answer as a literal still fails the rest (cases whose own test code
   prints different words are not compared - an answer cannot print those) */
for (const [id, spec] of Object.entries(globalThis.TESTS || {})){
  const q = QUESTIONS.find(x => x.id === id);
  const base = (q && q.run) || {};
  const setupOf = t => JSON.stringify([t.setup ?? base.setup ?? "", t.harness ?? base.harness ?? ""]);
  spec.tests.forEach((a, i) => spec.tests.forEach((b, j) => {
    if (j <= i || a.out === b.out || setupOf(a) !== setupOf(b)) return;
    if (ArrowMarking.sameOutput(a.out, b.out).ok || ArrowMarking.sameOutput(b.out, a.out).ok)
      fail("marking " + id, "cases " + (i + 1) + " and " + (j + 1) + " would pass for each other");
    else pass++;
  }));
}

/* ---------- report ---------- */
console.log("");
if (failures.length){
  for (const f of failures) console.log(`${RED}FAIL${OFF} ${f.where}\n     ${DIM}${f.detail}${OFF}`);
  console.log(`\n${RED}${failures.length} failing${OFF}, ${pass} passing\n`);
  process.exit(1);
}
console.log(`${GRN}All ${pass} checks passed.${OFF}`);
console.log(`${DIM}questions ${QUESTIONS.length} | library ${(globalThis.LIBRARY||[]).reduce((a,g)=>a+g.entries.length,0)} | snippets ${(globalThis.SNIPPETS||[]).length} | lessons ${LESSONS.length}${OFF}\n`);
