---
name: PlainCodeWords
description: Load it before naming a class, a method, a constant or a variable, or before writing a docstring, so the code says what it is in plain words and never in poetry.
summary: A name says what the thing is or does in ordinary words; a class has one line at its top and nothing else; no docstring or comment inside a method, none on a field.
tier: mandatory
languages: [python]
---

# Plain code words

Every name in this project says literally what the thing is or does, in ordinary words a newcomer reads at once.
A word that needs working out is poetry, and poetry is a sin here: `Said`, `about`, `worded`, `meaning`,
`whisper`. A class keeps one line at its top saying what it is, when the name does not already say it, and nothing
else: no docstring inside a method, no comment inside a method, no docstring under a field.

## When it fires

- **`poetic-type-name`** - a class named by a word that does not say what it is: `Said`, `Worded`, `Meaning`,
  `Whisper`, `Muse`, `Spoken`, `Utterance`. Name it for what it holds: a line with its values is a `Message`;
  a snapshot of the options is `Settings`.
- **`poetic-method-name`** - a method named by a word that does not say what it does: `about`, `worded`,
  `meaning`, `whisper`, `muse`, `spoken`, `typed`, `utter`, `tell`, `says`, `said`, `hear`, `heard`. Name it for
  what it does: `create`, `rendered`, `with_values`, `requested_run`.
- **`docstring-in-method`** - a docstring inside a method or a function. Say it in the name, or in the class's
  one line; a method's body carries no prose.
- **`field-docstring`** - a docstring under a field or a constant. Name the field so it needs none, or say it in
  the class's one line.
- **`column-word-in-text`** - a word ending in `_at` between the words of a sentence, such as `has not refused you
  skipped_at your last skip`. A rename of a variable reached the text. Write the words a person uses: `since your
  last skip`.

## The fix

- A commit listener declares the specific row or domain event it needs. `Touched[Model]` and
  `Changed[Model]` hear every model and require a named exception with a reason.
- Read rows together with `find_many` before a loop. Use `first()` for one row instead of a counted
  `.page(1, 1).rows` read.
- Restore stored model values through `Table`, whose state handling includes states added by modules.
- A commit listener uses declarations read when files change. It does not scan files or ask the skill
  catalogue to scan them on every event.

Trace the name to where the thing is born and name it there for what it is. A docstring or a comment in a body goes;
what it said goes into the name of the method, the field or a helper, or into the class's one line at the top.

## Written for the reader

Use the normal terms of programming any developer knows: skip a guard, never waive it; filter, page, query,
never a word you made up. No poetry and no voice in a name, a docstring or a message. Words that keep slipping in
are listed as forbidden in `.commandments/custom/lists.json`; add one there when the user strikes it.

A class's one line is written for a newcomer reading it cold: what the class is or does, in the words a person
would use, never a summary of its fields. "A command that moves a row from one state to the next", not "A
command that asks for one move of one row: the move, the row's id, and the move's own fields". A docstring line
wraps at 110 characters (`long-docstring-line`). The same holds for every document written about the code.

## Standard Go names

Go keywords and built-in calls keep the language's spelling. Use `ctx`, `ok` and `err` for their standard
context, lookup-success and error roles. The shared resource service uses `Kind`, `Kinds` and `kind` for
resource kinds. A SQL result may be named `result` when its type is `database/sql.Result` or its function
uses its `LastInsertId` or `RowsAffected` methods. A string named `result` has no such exception.

## Nudges name rows

A nudge names a row, its number and what happened, and never a command: the agent knows the commands
from its skills (`command-in-a-nudge`). Keep stored text, reasons, commands,
reports and titles in their rows. Counts, row types and paths are allowed; `path_fields` preserves a path,
never a command or a reason. `stored-text-in-a-nudge` checks templates, including plural templates and
aliased imports. Driver opening lines are static code instructions, and rule failures are code diagnostics;
those two declarations are exempt because neither copies a stored resource's words.
