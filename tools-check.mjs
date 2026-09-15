import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("./interpreter.js");
require("./bank.js");
const { PseudoRun } = globalThis;
const Q = globalThis.QUESTIONS_ALEVEL, R = globalThis.RUNSPECS_ALEVEL;
Object.keys(R).forEach(id => { const q = Q.find(x=>x.id===id); if (q) q.run = R[id]; });
let pass=0, fail=0;
for (const q of Q){
  if (q.kind!=="code" || !q.model) continue;
  const s=q.run||{}, setup=s.setup?s.setup+"\n":"", harness=s.harness?"\n"+s.harness:"";
  const lines=String(s.inputs||"").split("\n"); while(lines.length&&lines[lines.length-1]==="")lines.pop();
  const r=PseudoRun(setup+q.model+harness,{inputs:lines,files:s.files,offset:setup?setup.split("\n").length-1:0});
  if(r.ok){pass++;} else {fail++; console.log("FAIL",q.id,"L"+r.error.line+":",r.error.msg);}
}
console.log(`\nnode verify: ${pass} pass, ${fail} fail`);
process.exit(fail?1:0);
