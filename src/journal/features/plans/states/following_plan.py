from dataclasses import dataclass

from journal.features.tasks.states.working import Working
from journal.engine.transition import Transition
from journal.events.agent.idle import Idle as AgentIdle


@dataclass(frozen=True)
class FollowingPlan(Working):
    """Working, with a plan in hand: a finished task asks for the next one, and the last task ends the plan."""

    name = "following_plan"
    plan_id: int = 0

    def idle(self, event: AgentIdle) -> Transition: ...
