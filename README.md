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
