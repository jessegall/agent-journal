from dataclasses import dataclass

from journal.features.tasks.states.working import Working


@dataclass(frozen=True)
class FollowingPlan(Working):
    """Working, with a plan in hand: a finished task starts the next one, and the last task ends the plan."""

    name = "following_plan"
    plan_id: int = 0
