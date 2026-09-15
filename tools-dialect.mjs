import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("./interpreter.js");
const { PseudoRun } = globalThis;
const t = (name, src, level) => {
  const r = PseudoRun(src, { level });
  console.log(name.padEnd(26) + (r.ok ? "ok  " : "ERR ") +
    (r.ok ? r.output.join(" | ").slice(0,40) : r.error.msg) +
    (r.warnings.length ? "\n      -> " + r.warnings.join("\n      -> ") : ""));
};
t("IGCSE fns at IGCSE", `OUTPUT SUBSTRING("PROGRAMMING",4,3), " ", UCASE("ab"), " ", LCASE("CD"), " ", ROUND(3.14159,2)`, "igcse");
t("IGCSE fns at A2",    `OUTPUT SUBSTRING("PROGRAMMING",4,3), " ", UCASE("ab")`, "a2");
t("A-level fns at IGCSE",`OUTPUT MID("PROGRAMMING",4,3), " ", TO_UPPER("ab")`, "igcse");
t("A-level fns at AS",  `OUTPUT MID("PROGRAMMING",4,3), " ", TO_UPPER("ab")`, "as");
t("CONSTANT arrow",     `CONSTANT Pi <- 3.14\nOUTPUT Pi`, "igcse");
t("CONSTANT equals",    `CONSTANT Pi = 3.14\nOUTPUT Pi`, "as");
t("RANDOM()",           `DECLARE R : REAL\nR <- RANDOM()\nIF R >= 0 AND R < 1 THEN\n    OUTPUT "in range"\nENDIF`, "igcse");
t("record at IGCSE",    `TYPE P\n    DECLARE N : STRING\nENDTYPE\nDECLARE X : P\nX.N <- "a"\nOUTPUT X.N`, "igcse");
t("BYREF at IGCSE",     `PROCEDURE S(BYREF A : INTEGER)\n    A <- 9\nENDPROCEDURE\nDECLARE V : INTEGER\nV <- 1\nCALL S(V)\nOUTPUT V`, "igcse");
t("APPEND at IGCSE",    `OPENFILE "f.txt" FOR APPEND\nWRITEFILE "f.txt", "x"\nCLOSEFILE "f.txt"\nOUTPUT "done"`, "igcse");
t("no level set",       `OUTPUT SUBSTRING("abc",1,2), MID("abc",1,2)`, null);
