from journal.features.feature import Feature
from journal.features.helpers.states.awaiting import Awaiting
from journal.features.nudge import Nudge


class Helpers(Feature):
    name = "helpers"
    title = "Helpers"
    states = (Awaiting,)

    REPORTED = Nudge(name, "reported", "helper {{n}}, {{name}}, reported in message {{message}}")
    STOPPED = Nudge(name, "stopped", "helper {{n}}, {{name}}, stopped before it reported")
    REFUSED = Nudge(name, "refused", "helper {{n}}, {{name}}, cannot work: {{provider}} refused it")
    IDLE = Nudge(name, "idle", "helper {{n}}, {{name}}, has stood idle for {{minutes}} minutes")
    QUIET = Nudge(name, "quiet", "helper {{n}}, {{name}}, has done nothing for {{minutes}} minutes")
    RETURNED = Nudge(name, "returned", "what you waited on came back: carry on")
    WORKTREE_BEHIND = Nudge(name, "worktree_behind", "helper {{n}}'s worktree is behind the branch: rebase before taking it")
    nudges = (REPORTED, STOPPED, REFUSED, IDLE, QUIET, RETURNED, WORKTREE_BEHIND)
