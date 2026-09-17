# Work

Work is what the agent is doing right now, declared in its own words before it starts changing anything.

## How it is recorded

- **Started**: the agent names the work, often the title of a to-do.
- **Updated**: it notes what moved, such as a decision, a dead end or a change of approach.
- **Waiting**: it marks work that waits on something it cannot hurry, like a build or another agent.
- **Ended**: it closes the work. The to-do of the same title stays open unless the agent passes `--todo`: closing a to-do is always explicit, never a side effect of ending work.

Declaring work first means every change in the project belongs to something you can read back.

## What you can do

- See what is open, and the notes on each piece of work.
- End work yourself.
- To tell the agent something about a piece of work, leave a comment on it. Notes are the agent's own record: it reads comments, not notes.

## How the agent uses work

- **Declared before changing anything.** The journal refuses an edit, a deletion or a commit while no work is open. Reading is never refused.
- **Commands.** `journal work start` names the work, `journal work update` records what moved, `journal work await` marks waiting on a subagent or a build, and `journal work end` closes it.
- **Handed back.** Open work is listed in the block the agent receives at the start of each session and after a summary, so it picks up where it left off.
- **Recorded for it.** Files it changes and commits it makes while work is open are added to that work automatically.
