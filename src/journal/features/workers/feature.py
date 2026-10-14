from journal.features.feature import Feature
from journal.features.nudge import Nudge
from journal.features.skill import Skill
from journal.features.workers.commands.worker_command import WorkerCommand
from journal.features.workers.listeners.release_awaiting import ReleaseAwaiting
from journal.features.workers.states.awaiting import Awaiting


class Workers(Feature):
    """A worker is an agent sent to write: code in a worktree of its own, a document, a change. A subagent only reads; a worker is the one that writes."""

    name = "workers"
    title = "Workers"
    help = "Agents sent to write one bounded job; the agent waits for their reports."
    states = (Awaiting,)
    commands = (WorkerCommand,)
    listeners = (ReleaseAwaiting,)

    REPORTED = Nudge(name, "reported", "worker {{n}}, {{name}}, reported in {{message}}", repeat_after=0)
    STOPPED = Nudge(name, "stopped", "worker {{n}}, {{name}}, stopped before it reported", repeat_after=0)
    RETURNED = Nudge(name, "returned", "what you waited on came back: carry on", repeat_after=0)
    nudges = (REPORTED, STOPPED, RETURNED)

    skill = Skill("workers", 'Send a worker to write a bounded job and wait for its report; load it before dispatching one', """
# Workers

A subagent only reads. A worker writes: code in a worktree of its own, a document, a change.

- `journal worker dispatch "<Name>" "<bounded brief>" --model <model> [--worktree]`: name it after a
  distinguished figure with a twist on their trade, give it one job, and name the least expensive model that fits.
- `journal worker wait <n> [<n>...]` waits until they have reported; stopping is fine while you wait.
- A worker reports with `journal worker report <n> "<what it found or did>"`; you are told, and told again when
  the last one is back. `journal worker list` shows who is out.
""", keywords=('worker', 'workers', 'helper', 'dispatch', 'worktree'), required_in=('awaiting',))
