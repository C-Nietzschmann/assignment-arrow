# Assignment Arrow

A practice app for the pseudocode used in **Cambridge International AS & A Level Computer Science (9618)**.

Single HTML file, no build step, no dependencies. Open `index.html` in a browser and it works.

## What it does

**Course** — thirteen lessons in order, from `←` through to classes and inheritance. Each lesson teaches
the syntax, shows it working, names the mistake that loses marks, and ends with a check question.

**Practice** — a bank of original exam-style questions with a three-step tip ladder (nudge → structure →
near-answer), a model answer with commentary, and a mark scheme you tick yourself. Question types:
write-pseudocode, trace tables that mark cell by cell, and quick syntax drills.

**Question generator** — unlimited new questions in exam style, with a difficulty dial from Foundation to
Hardest, generated on demand for any topic and either paper. Requires the claude.ai hosted version.

**Your pseudocode actually runs.** The app contains a complete interpreter for the 9618 notation —
lexer, parser and evaluator, written from scratch, no dependencies. Loops loop, arrays fill, files are
read and written, records and classes work, recursion recurses. Press **Run it** and you get the output,
or a line-accurate error written the way a teacher would say it:

| It catches | It says |
|---|---|
| `Count = 0` | `'=' cannot be used to store a value in a variable.` |
| `NEXT j` after `FOR i` | `NEXT names 'j' but this FOR loop counts with 'i'.` |
| reading an unset total | `'Total' has been declared but nothing has been put in it yet.` |
| `FOR i <- 1 TO 6` on `ARRAY[1:5]` | `Index 6 is outside 'Scores', which runs from 1 to 5.` |
| dividing by a zero count | `You cannot divide by zero. A count that is still 0 is the usual cause.` |
| a loop that never ends | `Something inside the loop must change the value the condition tests.` |
| `OPENFILE ... FOR WRITE` to add a record | the file is genuinely emptied, so you see the data loss |

Questions that say data already exists — "an array that already holds the monthly rainfall" — really do
have that data seeded when you run them, so the output means something.

**Practice and exam behave differently on purpose.** In Practice you run your answer as often as you
like, read the error, fix it, run again. In Exam mode the Run button is gone; when the timer stops every
executable answer is run **once**, and code that does not run scores **zero** with its mark scheme
locked. The error is shown afterwards so you know what to drill.

**Exam mode** — a timed paper assembled from the bank, tips disabled, mark schemes sealed until the timer
stops. Self-marked at the end with a per-topic breakdown.

**Reference** — the whole 9618 notation on one filterable page.

**Progress** — marks banked per topic, weakest first, saved in the browser.

## Editor conveniences

- Typing `<-` becomes `←` automatically
- <kbd>Tab</kbd> indents four spaces, <kbd>Shift</kbd>+<kbd>Tab</kbd> outdents
- <kbd>Enter</kbd> after `THEN`, `DO` or `REPEAT` auto-indents the next line

## Running it

Open `index.html` directly, or serve the folder:

```
python3 -m http.server 8000
```

The course, question bank, exam mode, trace marking and progress all work entirely offline. Question
generation and AI marking light up only in the claude.ai hosted version; the page detects this and hides
those controls when they are unavailable.

## About the questions

**Every question in this repository is original.** No Cambridge past-paper material is reproduced, quoted
or included, and none is fetched at runtime. The generator is instructed to invent fresh scenarios rather
than recall real questions. Past papers are available through Cambridge's own channels and through your
school or teacher.

## Not affiliated

Assignment Arrow is an independent study tool. It is not affiliated with, endorsed by, or connected to
Cambridge Assessment International Education. "Cambridge International" and syllabus code 9618 are
referenced descriptively to identify the course this tool is designed for.

## Licence

MIT — see [LICENSE](LICENSE).
