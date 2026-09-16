# Assignment Arrow

A practice app for Cambridge pseudocode, covering **IGCSE 0478**, **AS 9618** and **A Level 9618**.

Static HTML and JavaScript. No build step, no dependencies, no account, no server. Open `index.html`
and it works — offline, from a USB stick, anywhere.

**Live:** deploy in two clicks with the Render blueprint below.

---

## What it does

**Pick your course first.** IGCSE, AS or A Level. That choice drives the lessons, the questions, the
exam papers, the library, and the notation the checker expects — because the two syllabuses genuinely
differ (`SUBSTRING` vs `MID`, `UCASE` vs `TO_UPPER`, and more). Switch any time from the sidebar;
progress is kept per course.

**Your pseudocode actually runs.** A complete interpreter — lexer, parser, evaluator, written from
scratch — covers both dialects: all data types with real type checking, 1D and 2D arrays, `IF` and
`CASE`, all three loops, procedures and functions with `BYVAL`/`BYREF`, records, enumerated types,
classes with inheritance and enforced encapsulation, recursion, text files and random-access files.

The errors are the teaching surface. Each one is line-accurate and phrased the way a teacher would
say it, aimed at exactly what loses marks:

| It catches | It says |
|---|---|
| `Count = 0` | `'=' cannot be used to store a value in a variable.` |
| `NEXT j` after `FOR i` | `NEXT names 'j' but this FOR loop counts with 'i'.` |
| reading an unset total | `'Total' has been declared but nothing has been put in it yet.` |
| `FOR i <- 1 TO 6` on `ARRAY[1:5]` | `Index 6 is outside 'Scores', which runs from 1 to 5.` |
| dividing by a zero count | `You cannot divide by zero. A count that is still 0 is the usual cause.` |
| a loop that cannot end | `Something inside the loop must change the value the condition tests.` |
| `MID` while sitting IGCSE | `MID is AS/A Level notation. For IGCSE 0478 write SUBSTRING instead.` |

Mixing dialects is never an error, only advice — you are never blocked mid-question.

**It marks your answer for you, and you cannot cheat it.** Press *Mark my answer* and the app runs
your code against **several hidden test cases** whose expected output came from running the verified
model answer — then checks the source for the constructs the question actually requires. The score is
worked out, not claimed.

| What you submit | What it scores |
|---|---|
| A correct answer | full marks |
| The right answer printed as a literal | 1 / 5 — it passes one case and fails the rest |
| Correct logic, but not the method the question asked for | 3 / 5 — works, loses the structure marks |
| `DIV` and `MOD` hidden inside a comment | 0 / 5 — comments are stripped before checking |
| Code that does not run | 0 / 5 |

You see which cases passed, and the input and expected output of the **first** failure only — enough to
debug, not enough to hardcode your way out, because the others use different data. Exam mode marks the
whole paper this way when the timer stops.

**98 original questions.** Write-pseudocode, trace tables marked cell by cell, spot-the-error, and
quick syntax drills. Every one has a three-step tip ladder (a nudge, then the technique, then close
to the answer), a commented model answer, and a mark scheme you tick yourself.

**Practice and exam behave differently on purpose.** In Practice you run and mark your answer as often
as you like — read the error, fix it, try again. In Exam mode the Run button is gone; when the timer
stops the whole paper is marked in one pass, and code that does not run scores **zero**.

**A runnable library.** 78 entries covering every keyword and built-in function, each with a
signature, level badges, a worked example you can run and edit, and the mistake people actually make.
Plus the IGCSE ↔ A Level dialect map and 11 patterns worth knowing by heart.

**23 lessons.** Ten for IGCSE, thirteen for AS and A Level. Each teaches the syntax, shows it working,
names the mistake that loses marks, and ends with a check question.

---

## Deploying to Render

**Blueprint:** Render dashboard → New → Blueprint → choose this repository. `render.yaml` does the rest.

**By hand:** New → Static Site → connect the repo → Publish directory `.` → Create.

Free tier, no cold starts, no environment variables. Each student's progress is stored in their own
browser, so nobody's scores interfere with anybody else's, and no personal data ever leaves the
machine.

### The optional generator

`server/` can generate unlimited fresh questions, but it is **off and not needed**. Turn it on only if
you want it: deploy `server/` as a Web Service, `npm install`, and set the values in `.env.example`
(including a class access code, a per-browser rate limit and a daily cap — the endpoint is public and
the credit is yours). Render has no "import .env" button; paste those lines into the service's
Environment tab. Never commit a filled-in `.env` — this repository is public.

---

## Verifying

```
node tools/verify.mjs      # every model answer and library example still works
node tools/bake-tests.mjs  # regenerate tests.js after editing any question bank
```

`bake-tests.mjs` runs each model answer against its input sets and writes the expected outputs into
`tests.js`, so the marking data can never drift from the questions. It reports which questions have
only a single case — those are the ones where hardcoding is not detectable by output alone and the
structural checks carry the mark.

Runs every model answer and every library example through the real interpreter and checks the output
matches what is documented; that mark schemes sum to the stated marks; that every question has three
tips, a level and a difficulty; and that trace rows match their column count. 208 checks. It has
already caught four interpreter bugs that reading the code did not.

## Editor

Typing `<-` becomes `←`. <kbd>Tab</kbd> indents four spaces, <kbd>Shift</kbd>+<kbd>Tab</kbd> outdents.
<kbd>Enter</kbd> after `THEN`, `DO` or `REPEAT` auto-indents.

## About the questions

**Every question here is original.** No Cambridge past-paper material is reproduced, quoted or
fetched at runtime. Past papers are available through your school and Cambridge's own channels.

## Not affiliated

An independent study tool, not affiliated with, endorsed by or connected to Cambridge Assessment
International Education. Syllabus codes are used descriptively to identify the courses it targets.

## Licence

MIT — see [LICENSE](LICENSE).
