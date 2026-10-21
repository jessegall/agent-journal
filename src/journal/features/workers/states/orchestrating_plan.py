from dataclasses import dataclass

from journal.features.plans.states.following_plan import FollowingPlan
from journal.features.workers.states.delegation import Delegation


@dataclass(frozen=True)
class OrchestratingPlan(Delegation, FollowingPlan):
    """Following a plan as the orchestrator: the task in hand is handed to a worker and its report reviewed, never done by the agent itself."""

    name = "orchestrating_plan"
    title = "Orchestrating a plan"
