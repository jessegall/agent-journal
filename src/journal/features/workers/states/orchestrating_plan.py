from dataclasses import dataclass

from journal.engine.nudge import Nudge
from journal.features.plans.states.following_plan import FollowingPlan


@dataclass(frozen=True)
class OrchestratingPlan(FollowingPlan):
    """Following a plan as the orchestrator: the task in hand is handed to a worker and its report reviewed, never done by the agent itself."""

    name = "orchestrating_plan"
    title = "Orchestrating a plan"

    def continue_nudge(self, time: float) -> Nudge:
        from journal.features.workers.feature import Workers
        return Workers.DELEGATE_THE_TASK.create(name=self.named(), logged=self.logged_words(time))
