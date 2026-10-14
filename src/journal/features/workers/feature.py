from journal.features.feature import Feature
from journal.features.nudge import Nudge
from journal.features.workers.states.awaiting import Awaiting


class Workers(Feature):
    """A worker is an agent sent to write: code in a worktree of its own, a document, a change. A subagent only reads; a worker is the one that writes."""

    name = "workers"
    title = "Workers"
    states = (Awaiting,)

    REPORTED = Nudge(name, "reported", "worker {{n}}, {{name}}, reported in message {{message}}")
    STOPPED = Nudge(name, "stopped", "worker {{n}}, {{name}}, stopped before it reported")
    REFUSED = Nudge(name, "refused", "worker {{n}}, {{name}}, cannot work: {{provider}} refused it")
    IDLE = Nudge(name, "idle", "worker {{n}}, {{name}}, has stood idle for {{minutes}} minutes")
    QUIET = Nudge(name, "quiet", "worker {{n}}, {{name}}, has done nothing for {{minutes}} minutes")
    RETURNED = Nudge(name, "returned", "what you waited on came back: carry on")
    WORKTREE_BEHIND = Nudge(name, "worktree_behind", "worker {{n}}'s worktree is behind the branch: rebase before taking it")
    nudges = (REPORTED, STOPPED, REFUSED, IDLE, QUIET, RETURNED, WORKTREE_BEHIND)
