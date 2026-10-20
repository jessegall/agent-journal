from dataclasses import dataclass

from journal.engine.agent_state import AgentState
from journal.support.permission import Permission
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.tool_starting import ToolStarting


@dataclass(frozen=True)
class Idle(AgentState):
    """Nothing declared: the agent may read and run, not write. Where every session starts."""

    name = "idle"
    title = "Idle"
    allows = frozenset({Permission.RUN_COMMANDS})

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        return self.stay()

    def on_session_started(self, event: SessionStarted, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        from journal.features.plans.states.following_plan import FollowingPlan
        started = event.standing.of(Plans).started
        return self.push(FollowingPlan(plan_id=started.plan_id, task_id=started.started_task)) if started else self.stay()
