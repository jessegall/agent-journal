from dataclasses import dataclass

from core.modules.agents.models.agent import Agent
from core.modules.usage.support.plan_window import PlanWindow
from core.modules.usage.support.session_status import SessionStatus, WINDOW_TITLES


@dataclass(frozen=True)
class EnvironmentUsage:
    """The usage of one environment's open sessions: each agent with its status, and the plan's windows."""

    agents: tuple[tuple[Agent, SessionStatus], ...]
    windows: tuple[PlanWindow, ...]

    @property
    def unreported_windows(self) -> tuple[str, ...]:
        reported = {window.title for window in self.windows}
        return tuple(title for title in WINDOW_TITLES.values() if title not in reported)

    @property
    def cost_dollars(self) -> float:
        return sum(status.cost_dollars for _, status in self.agents)
