# Messages

Messages are how you talk to the agent from here. Write an instruction, a follow-up or an idea, and attach files if they help.

## What happens to a message

The agent reads it at its next stop and splits it into parts. Each part becomes something: a to-do, a question, a pin, a rule, a reminder, or a note on the work it is doing now. The message is then marked **processed**. Open it to see each part and what it became.

A message waits until an agent picks it up. If no agent is working on this environment, it waits for the next session.

## What you can do

- Send a message from the box at the bottom. **Enter** sends; **Shift+Enter** starts a new line.
- Edit a message while it still waits.
- Open a processed one to check your words landed where you meant.

Messages are never deleted.

## How the agent uses messages

- **Told at its next stop.** When a message waits, the agent's next stop says so, and it runs `journal messages show <n>` to read it.
- **Woken when idle.** If the agent was started under the launcher (`journal claude`, `journal codex`), a new message is also typed into a session that is sitting idle.
- **Filing each part.** For every part it records what the part became with `journal messages process <n> --part="…" --became=…`, then `journal messages done <n>`.
