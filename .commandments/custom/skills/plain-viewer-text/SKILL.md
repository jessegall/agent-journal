---
name: PlainViewerText
description: Load it before writing or changing any text a person reads in the viewer - a label, title, placeholder, tooltip, help line, empty state or button - so it says what it is in plain words.
summary: Viewer text names who acts and what happens, in the house words; never the app as I, never internal jargon.
tier: mandatory
languages: [vue, python]
---

# Plain viewer text

The viewer is a program, not a person, and its user is not a developer of the journal. Every text they read
says what it is about, or what happens when they press it, in the words a newcomer uses.

## When it fires

- **`plain-viewer-text`** - a label, title, placeholder, tooltip or help attribute, a label, title, hint, heading, placeholder, help, line, note or empty value in a script, or text on a page, that:
  - speaks as the app: "I sort it by subject", "What I'm doing", "my", "we";
  - uses a word from inside the journal: row, hook, nudge, engine, compact, summarised, "comes up", pile,
    hub, steered, inject, dispatched, moment, resource, orchestrator, "ships with";
  - uses one of the words the house has replaced: park (Pause), dismiss or abandon (Close).

## How to fix it

- Name who acts: "The agent sorts it by subject", "What the agent is doing".
- Say the thing the user sees: "item", "to-do", "message", "entry", not "row"; "comes with the journal",
  not "ships with".
- A button says what happens when it is pressed: "Close the document", "Pause the plan".
- A heading names what the user is choosing or reading, in a newcomer's words: "Trigger when",
  never "Where the words count" (rule 59). A heading never ends in a preposition, and an option finishes
  its heading's sentence: "Trigger when" -> "A word appears anywhere".
- An example of what the user would write about themselves stays in their voice: start it "For example".

## Not this sin

- Text the user writes, or a quoted example of it.
- A word used for what it means to the user: "hook" in the Hooks page of an agent, where the page is about
  exactly that, still wants a short gloss the first time it appears.
