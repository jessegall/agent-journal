from journal.features.entry import Entry
from journal.features.feature import Feature
from journal.engine.nudge import Nudge
from journal.models.option import Option
from journal.models.node_kind import NodeKind
from journal.features.skill import Skill
from journal.features.workers.commands.worker_command import WorkerCommand
from journal.features.workers.states.awaiting import Awaiting
from journal.features.workers.listeners.mark_subagents import MarkSubagents


class Workers(Feature):
    """A worker is an agent sent to write: code in a worktree of its own, a document, a change. A subagent only reads; a worker is the one that writes."""

    name = "workers"
    title = "Workers"
    help = "Agents sent to write one bounded job; the agent waits for their reports."
    TIMEOUT = Option("workers.timeout_minutes", "Time limit of a worker run", "Minutes a worker may run before it is stopped and its report says so; 0 sets no limit", 60, unit="min")
    options = (TIMEOUT,)
    states = (Awaiting,)
    commands = (WorkerCommand,)
    listeners = (MarkSubagents,)
    checks = (
        Entry(NodeKind.CHECK, 'worker_reported', 'Worker reported?', 'the row is a worker that just reported'),
        Entry(NodeKind.CHECK, 'worker_stopped', 'Worker stopped?', 'the row is a worker that just stopped before reporting'),
        Entry(NodeKind.CHECK, 'agent_awaits_the_worker', 'Agent awaits this worker?', 'the agent waits on the worker of this row'),
        Entry(NodeKind.CHECK, 'last_worker_back', 'Last worker back?', 'every worker the agent waits on has reported or stopped'),
        Entry(NodeKind.CHECK, 'worker_report_waiting', 'Has a worker report not acted on?', 'a worker here reported and the agent has not given it its next job, stopped it or marked it done'),
    )

    REPORTED = Nudge(name, "reported", "worker {{n}}, {{name}}, reported in {{message}}", repeat_after=0)
    STOPPED = Nudge(name, "stopped", "worker {{n}}, {{name}}, stopped before it reported", repeat_after=0)
    RETURNED = Nudge(name, "returned", "what you waited on came back: carry on", repeat_after=0)
    REPORTS_WAITING = Nudge(name, "reports_waiting", "{{reports_waiting}} reported and you have not acted on it yet", "read its report, then give it its next job, stop it, or mark it done once its work is merged or used", repeat_after=180)
    nudges = (REPORTED, STOPPED, RETURNED, REPORTS_WAITING)

    skill = Skill("workers", 'Send a worker to write a bounded job and wait for its report; load it before dispatching one', """
# Workers

A subagent only reads. A worker writes: code in a worktree of its own, a document, a change.

- `journal worker dispatch "<Name>" "<bounded brief>" --model <model> [--worktree]`: name it after a
  distinguished figure with a twist on their trade, give it one job, and name the least expensive model that fits.
- `journal worker wait <n> [<n>...]` waits until they have reported; stopping is fine while you wait.
- A worker reports with `journal worker report <n> "<what it found or did>"`; you are told, and told again when
  the last one is back. `journal worker list` shows who is out.
- A report is acted on once you give the worker its next job, stop it, or `journal worker done <n>` when its work is
  merged or used; until then you are told of it again at each stop and every so many tool uses.
- Related work goes back to the worker that knows it: `journal worker say <n> "<next job>"` sends a worker that
  reported out again with its memory of the last job, in the same worktree. Never dispatch a fresh worker for
  work one already out has done part of.
""", keywords=('worker', 'workers', 'helper', 'dispatch', 'worktree', 'say'), required_in=('awaiting',))
