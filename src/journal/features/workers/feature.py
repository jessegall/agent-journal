from journal.features.entry import Entry
from journal.features.feature import Feature
from journal.features.nudge import Nudge
from journal.models.node_kind import NodeKind
from journal.features.skill import Skill
from journal.features.workers.commands.worker_command import WorkerCommand
from journal.features.workers.states.awaiting import Awaiting


class Workers(Feature):
    """A worker is an agent sent to write: code in a worktree of its own, a document, a change. A subagent only reads; a worker is the one that writes."""

    name = "workers"
    title = "Workers"
    help = "Agents sent to write one bounded job; the agent waits for their reports."
    states = (Awaiting,)
    commands = (WorkerCommand,)
    listeners = ()
    checks = (
        Entry(NodeKind.CHECK, 'worker_reported', 'Worker reported?', 'the row is a worker that just reported'),
        Entry(NodeKind.CHECK, 'worker_stopped', 'Worker stopped?', 'the row is a worker that just stopped before reporting'),
        Entry(NodeKind.CHECK, 'agent_awaits_the_worker', 'Agent awaits this worker?', 'the agent waits on the worker of this row'),
        Entry(NodeKind.CHECK, 'last_worker_back', 'Last worker back?', 'every worker the agent waits on has reported or stopped'),
    )

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
- Related work goes back to the worker that knows it: `journal worker say <n> "<next job>"` sends a worker that
  reported out again with its memory of the last job, in the same worktree. Never dispatch a fresh worker for
  work one already out has done part of.
""", keywords=('worker', 'workers', 'helper', 'dispatch', 'worktree', 'say'), required_in=('awaiting',))
