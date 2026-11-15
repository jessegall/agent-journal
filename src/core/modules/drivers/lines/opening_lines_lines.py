from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.nudge import Nudge
from engine.enums.hook_event_name import HookEventName
from engine.registry.registry import Registry
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.nudges.opening_line_nudge import OpeningLineNudge
from core.modules.drivers.support.actor_loader import ActorLoader


class OpeningLinesLines(EventLineSource):
    """A session's start gives the agent its driver's opening lines."""

    key = "drivers.opening-lines"
    events = [HookEventName.SESSION_START]

    def __init__(self, registry: Registry, agents: AgentRows, loader: ActorLoader) -> None:
        self.registry, self.agents, self.loader = registry, agents, loader

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        return self.driver_lines(self.loader.loaded(self.agents.find(agent_id)).driver)

    def driver_lines(self, driver_name: str) -> list[Nudge]:
        driver = self.registry.driver(driver_name)
        return [OpeningLineNudge.declared().nudge(text=line) for line in driver.opening_lines] if driver is not None else []
