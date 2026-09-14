# Transcript

The transcript is the agent's session itself: what you said, what it answered, and what it ran.

## Compact or full

- **Compact** shows the conversation: your messages and the agent's replies, with the tools each step used.
- **Full** also shows every tool's output and what the journal told the agent along the way.

## Reading back

The newest part loads first. **Load earlier** goes back a page at a time, so a long session does not load all at once. **Newest** jumps back to the end.

Clicking one of the agent's lines in Activity, such as "Ran 3 commands", opens the transcript at that moment and highlights the steps it covers.

## How the agent uses it

- **Reading instead of remembering.** When the agent is unsure what was decided, it reads the transcript back with `journal conversation --back=1` and `journal user`, rather than answering from what survived a summary.
- **Line numbers are citations.** A pin or a brief can point at a line, like "turn 412", and that number is the one shown here.
