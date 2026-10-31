---
name: PlainCodeWords
description: Load it before naming a class, a method, a constant or a nudge, or before writing a docstring, so the code says what it is in plain words and never in poetry.
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
  `Whisper`, `Muse`, `TypedNudges`, `Spoken`, `Utterance`. Name it for what it holds: a line with its values is a
  `Nudge`; a snapshot of the options is `Settings`.
- **`poetic-method-name`** - a method named by a word that does not say what it does: `about`, `worded`,
  `meaning`, `whisper`, `muse`, `spoken`, `typed`, `utter`, `tell`, `says`, `said`, `hear`, `heard`. Name it for
  what it does: `create`, `rendered`, `with_values`, `on_tool_starting`.
- **`docstring-in-method`** - a docstring inside a method or a function. Say it in the name, or in the class's
  one line; a method's body carries no prose.
- **`comment-in-method`** - a comment inside a method or a function (a draft rule, `CommentInMethodDetector.json.draft`,
  not yet proved: the plugin's tree gives a comment above a `def` to its parameters, so the rule cannot yet tell it
  from one inside the body). Say it in a name instead, or in the class's one line.
- **`field-docstring`** - a docstring under a field or a constant. Name the field so it needs none, or say it in
  the class's one line.

- **`state-machine-outside-engine`** - a file outside `journal/engine` imports the state machine. Only the engine
  and `journal panic` touch it: a command writes rows, the model names the event, the state answers it.

## The fix

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
