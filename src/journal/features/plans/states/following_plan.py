from dataclasses import dataclass

from journal.features.tasks.states.working import Working


@dataclass(frozen=True)
class FollowingPlan(Working):
    """Working, with a plan in hand, for the plan's whole life: a finished task starts the next one, a checkpoint stands with no task in hand until the user looks, and the last task ends the plan."""

    name = "following_plan"
    title = "Following a plan"
    plan_id: int = 0

    def follows_a_plan(self) -> bool:
        return True

    def named(self) -> str:
        return super().named() if self.task_id else f"plan {self.plan_id}, with no task in hand"
