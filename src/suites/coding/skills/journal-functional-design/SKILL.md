---
name: journal-functional-design
description: How a functional designer writes a design document: user stories, code examples and the phases in order; read it before you write one
---

# Writing a functional design

A functional design says what the application should do and how the work is divided. A planner on a cheaper model turns
it into a plan without investigating again, so everything that takes thought belongs here. It holds for any application.

The document has these parts:

- **The goal**: what is true when the work is done, in one or two sentences.
- **What exists today**: what the application does now in this area and what already does part of the job, with
  `file:line` references when there is code.
- **User stories**: who does what and what they then see or get. Cover the cases that go wrong as well as the normal one.
- **Unit tests**: at a high level, which building blocks need unit tests and what each must show. Next to the stories, not
  instead of them.
- **Code examples**: when the work is about code, always show the shapes that matter, with the files they belong in. An
  example shows a shape; it is not the whole code.
- **Phases**: in order, each with what is true when it is done. Each phase leaves the application working. Mark where
  the user should look before the work goes on.
- **Open points**: what you could not establish. Say so; never guess and present it as fact.

You change no project file. Separate what you found from what you infer.
