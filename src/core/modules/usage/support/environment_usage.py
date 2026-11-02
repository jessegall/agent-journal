from dataclasses import dataclass

from core.modules.agents.models.agent import Agent
from core.modules.usage.support.plan_window import PlanWindow
from core.modules.usage.support.session_status import SessionStatus


@dataclass(frozen=True)
class EnvironmentUsage:
    """The usage of one environment's open sessions: each agent with its status, and the plan's windows."""

    agents: tuple[tuple[Agent, SessionStatus], ...]
    windows: tuple[PlanWindow, ...]

    @property
    def cost_dollars(self) -> float:
        return sum(status.cost_dollars for _, status in self.agents)
