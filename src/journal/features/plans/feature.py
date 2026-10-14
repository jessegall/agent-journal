from journal.features.feature import Feature
from journal.features.nudge import Nudge
from journal.features.plans.states.following_plan import FollowingPlan


class Plans(Feature):
    name = "plans"
    title = "Plans"
    states = (FollowingPlan,)

    STARTED = Nudge(name, "started", "the user started plan {{n}}, {{title}}: build it with them")
    PHASES = Nudge(name, "phases", "plan {{n}} is building: add its phases")
    TASKS = Nudge(name, "tasks", "plan {{n}} is at its tasks")
    READY = Nudge(name, "ready", "every phase of plan {{n}} has its tasks")
    REVIEWED = Nudge(name, "reviewed", "the review of plan {{n}} is in: report {{report}}")
    APPROVED = Nudge(name, "approved", "the user approved plan {{n}}: start it")
    PARKED = Nudge(name, "parked", "the user parked plan {{n}}")
    NEXT = Nudge(name, "next", "plan {{n}}: task {{task}} is next")
    DONE = Nudge(name, "done", "plan {{n}} is done: its last task closed")
    nudges = (STARTED, PHASES, TASKS, READY, REVIEWED, APPROVED, PARKED, NEXT, DONE)
