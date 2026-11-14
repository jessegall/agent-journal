---
name: journal-flowcharts
description: Draw a flowchart in the chat and know when one fits; read it when the user asks for a flowchart or a diagram, or a process with branches is easier to see than to read
---

# Flowcharts

A flowchart shows in the chat as a card the user opens into a chart they can zoom and pan.

- `journal message flowchart "<title>" --edge "From -> To" --edge "From -> To: label" ...` draws one; each `--edge`
  is one arrow, its label the words after the colon. A card's name holds no colon: write "Active, the agent works"
  rather than "Active: the agent works". Name each card the same way every time it appears, or it is drawn twice.
- A flowchart fits a process with branches, a decision with more than one path, or a thing's states and the moves
  between them: the user sees at once where each path leads. Draw one when the user asks for it, or asks whether you
  understood a rule of that shape.
- A flowchart does not fit steps that only follow each other (write a numbered list) or one path with no choice (say it
  in words).
- Keep cards short, a state or an action of a few words, and put the condition on the arrow: "Paused -> Active: the
  agent starts it again". Arrows may go back up; they are drawn round the side.
