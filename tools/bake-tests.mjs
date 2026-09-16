#!/usr/bin/env node
/* ============================================================================
   BAKE TESTS
   Runs every question's model answer against its input sets and writes the
   resulting output back into the bank as `tests`. The expected output is
   therefore never hand-typed - it is whatever the verified model answer
   actually produces.

   Source of the input sets:
     run.inputs / run.files   the set already used for verification
     altInputs / altFiles     extra sets written per question

   Usage: node tools/bake-tests.mjs
   ========================================================================== */
import { createRequire } from "module";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const require = createRequire(import.meta.url);
const { ALT } = await import("./alt-sets.mjs");
require(path.join(root, "interpreter.js"));

const FILES = ["bank.js", "bank-igcse.js", "bank-extra.js"];
const GLOBALS = { "bank.js":"QUESTIONS_ALEVEL", "bank-igcse.js":"QUESTIONS_IGCSE", "bank-extra.js":"QUESTIONS_EXTRA" };
FILES.forEach(f => require(path.join(root, f)));
const RUNSPECS = globalThis.RUNSPECS_ALEVEL || {};

const { PseudoRun } = globalThis;

/* What a correct answer must visibly contain, read off the model answer. Kept
   permissive: either dialect satisfies a library requirement, and any loop
   satisfies "a loop", because more than one shape can be right. */
function strip(src){ return src.replace(/\/\/[^\n]*/g, "").toUpperCase(); }
const REQ_RULES = [
  [/\b(FOR|WHILE|REPEAT)\b/,        "(FOR|WHILE|REPEAT)",           "a loop"],
  [/\b(IF|CASE)\b/,                 "(IF|CASE)",                    "a selection statement"],
  [/\bMOD\s*\(/,                    "MOD\\s*\\(",                    "MOD"],
  [/\bDIV\s*\(/,                    "DIV\\s*\\(",                    "DIV"],
  [/\bLENGTH\s*\(/,                 "LENGTH\\s*\\(",                 "LENGTH"],
  [/\b(MID|SUBSTRING)\s*\(/,        "(MID|SUBSTRING)\\s*\\(",        "MID or SUBSTRING"],
  [/\b(TO_UPPER|UCASE|TO_LOWER|LCASE)\s*\(/, "(TO_UPPER|UCASE|TO_LOWER|LCASE)\\s*\\(", "a case-folding function"],
  [/\bEOF\s*\(/,                    "EOF\\s*\\(",                    "EOF"],
  [/\bOPENFILE\b/,                  "OPENFILE",                     "OPENFILE"],
  [/\bCLOSEFILE\b/,                 "CLOSEFILE",                    "CLOSEFILE"],
  [/\bFUNCTION\b/,                  "FUNCTION",                     "a FUNCTION"],
  [/\bRETURNS\b/,                   "RETURNS",                      "RETURNS on the header"],
  [/\bRETURN\b/,                    "RETURN\\b",                    "RETURN"],
  [/\bPROCEDURE\b/,                 "PROCEDURE",                    "a PROCEDURE"],
  [/\bBYREF\b/,                     "BYREF",                        "a BYREF parameter"],
  [/\bARRAY\s*\[/,                  "ARRAY\\s*\\[",                  "an ARRAY declaration"],
  [/\bTYPE\b[\s\S]*\bENDTYPE\b/,   "TYPE[\\s\\S]*ENDTYPE",         "TYPE ... ENDTYPE"],
  [/\bCLASS\b/,                     "CLASS",                        "a CLASS"],
  [/\bPRIVATE\b/,                   "PRIVATE",                      "PRIVATE attributes"],
  [/\bINHERITS\b/,                  "INHERITS",                     "INHERITS"],
  [/\bCONSTANT\b/,                  "CONSTANT",                     "a CONSTANT"],
  [/\bSEEK\b/,                      "SEEK",                         "SEEK"]
];
function requirementsFrom(model){
  const m = strip(model);
  const out = [];
  for (const [probe, re, label] of REQ_RULES){
    if (probe.test(m)) out.push({ re, t:label });
    if (out.length >= 5) break;
  }
  return out;
}

function runOnce(model, spec, over){
  spec = spec || {};
  const setup   = spec.setup   ? spec.setup + "\n" : "";
  let harness = spec.harness ? "\n" + spec.harness : "";
  const harnessOver = (over && over.harness !== undefined && over.harness !== null)
        ? "\n" + over.harness : null;
  const inputs = (over && over.inputs !== undefined) ? over.inputs : spec.inputs;
  const files  = (over && over.files  !== undefined) ? over.files  : spec.files;
  if (harnessOver !== null) harness = harnessOver;
  if (over && over.setup !== undefined && over.setup !== null){
    const st = over.setup ? over.setup + "\n" : "";
    const lines0 = String(inputs || "").replace(/\r/g,"").split("\n");
    while (lines0.length && lines0[lines0.length-1] === "") lines0.pop();
    return PseudoRun(st + model + harness, { inputs:lines0, files:files,
      offset: st ? st.split("\n").length - 1 : 0 });
  }
  const lines = String(inputs || "").replace(/\r/g, "").split("\n");
  while (lines.length && lines[lines.length - 1] === "") lines.pop();
  return PseudoRun(setup + model + harness, {
    inputs: lines, files: files,
    offset: setup ? setup.split("\n").length - 1 : 0
  });
}

let baked = 0, skipped = [];
const out = {};

for (const f of FILES){
  const list = globalThis[GLOBALS[f]] || [];
  for (const q of list){
    if (q.kind !== "code" || !q.model) continue;
    const spec = q.run || RUNSPECS[q.id];
    if (q.nondeterministic){ skipped.push(q.id + " (nondeterministic)"); continue; }

    const alt = ALT[q.id] || {};
    const sets = [{ inputs: spec && spec.inputs, files: spec && spec.files, setup: spec && spec.setup }];
    (alt.inputs || []).forEach(i  => sets.push({ inputs:i, files:spec&&spec.files, setup:spec&&spec.setup }));
    (alt.files  || []).forEach(fl => sets.push({ inputs:spec&&spec.inputs, files:fl, setup:spec&&spec.setup }));
    (alt.setup  || []).forEach(st => sets.push({ inputs:spec&&spec.inputs, files:spec&&spec.files, setup:st }));
    (alt.harness|| []).forEach(hz => sets.push({ inputs:spec&&spec.inputs, files:spec&&spec.files, setup:spec&&spec.setup, harness:hz }));

    const tests = [];
    let bad = false;
    for (const set of sets){
      const r = runOnce(q.model, spec, set);
      if (!r.ok){ skipped.push(q.id + " (model failed on a set: " + r.error.msg + ")"); bad = true; break; }
      tests.push({ inputs:set.inputs, files:set.files, setup:set.setup, harness:set.harness, out:r.output.join("\n") });
    }
    if (bad) continue;

    // a question whose sets all give the same output cannot detect hardcoding,
    // so say so rather than pretend the mark is safe
    const distinct = new Set(tests.map(t => t.out)).size;
    out[q.id] = { tests, require: requirementsFrom(q.model), weak: tests.length < 2 || distinct < 2 };
    baked++;
  }
}

fs.writeFileSync(path.join(root, "tests.js"),
  "/* GENERATED by tools/bake-tests.mjs - do not edit by hand.\n" +
  "   Expected outputs come from running each verified model answer, so they\n" +
  "   cannot drift from the questions. Re-run the script after editing a bank. */\n" +
  '"use strict";\n' +
  'var __g = (typeof window !== "undefined") ? window : globalThis;\n' +
  "__g.TESTS = " + JSON.stringify(out) + ";\n");
const weak = Object.entries(out).filter(([, v]) => v.weak).map(([k]) => k);
console.log(`baked ${baked} questions -> tests.js`);
console.log(`  multi-case (hardcoding detectable): ${baked - weak.length}`);
console.log(`  single-case: ${weak.length}${weak.length ? "  " + weak.join(" ") : ""}`);
if (skipped.length) console.log("  skipped: " + skipped.join(", "));
