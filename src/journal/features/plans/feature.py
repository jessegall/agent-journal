from journal.features.feature import Feature
from journal.features.nudge import Nudge
from journal.features.plans.commands.plan_command import PlanCommand
from journal.features.plans.listeners.advance_plan import AdvancePlan
from journal.features.plans.states.following_plan import FollowingPlan


class Plans(Feature):
    name = "plans"
    title = "Plans"
    states = (FollowingPlan,)
    commands = (PlanCommand,)
    listeners = (AdvancePlan,)

    NEXT = Nudge(name, "next", "plan {{n}}: task {{task}} is next, {{title}}", repeat_after=0)
    DONE = Nudge(name, "done", "plan {{n}} is done: its last task closed", repeat_after=0)
    PARKED = Nudge(name, "parked", "the user parked plan {{n}}")
    nudges = (NEXT, DONE, PARKED)
