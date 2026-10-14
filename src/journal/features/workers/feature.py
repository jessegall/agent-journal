from journal.features.feature import Feature
from journal.features.nudge import Nudge
from journal.features.workers.commands.worker_command import WorkerCommand
from journal.features.workers.listeners.release_awaiting import ReleaseAwaiting
from journal.features.workers.states.awaiting import Awaiting


class Workers(Feature):
    """A worker is an agent sent to write: code in a worktree of its own, a document, a change. A subagent only reads; a worker is the one that writes."""

    name = "workers"
    title = "Workers"
    states = (Awaiting,)
    commands = (WorkerCommand,)
    listeners = (ReleaseAwaiting,)

    REPORTED = Nudge(name, "reported", "worker {{n}}, {{name}}, reported in {{message}}", repeat_after=0)
    STOPPED = Nudge(name, "stopped", "worker {{n}}, {{name}}, stopped before it reported", repeat_after=0)
    RETURNED = Nudge(name, "returned", "what you waited on came back: carry on", repeat_after=0)
    nudges = (REPORTED, STOPPED, RETURNED)
