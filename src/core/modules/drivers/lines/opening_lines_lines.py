from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.hook_event_name import HookEventName
from engine.registry.registry import Registry
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.agent_messages.opening_line_message import OpeningLineMessage
from core.modules.drivers.support.actor_loader import ActorLoader


class OpeningLinesLines(EventLineSource):
    """A session's start gives the agent its driver's opening lines."""

    start_line = True
    key = "drivers.opening-lines"
    events = [HookEventName.SESSION_START]

    def __init__(self, registry: Registry, agents: AgentRows, loader: ActorLoader) -> None:
        self.registry, self.agents, self.loader = registry, agents, loader

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        return self.driver_lines(self.loader.loaded(self.agents.find(agent_id)).driver)

    def driver_lines(self, driver_name: str) -> list[AgentMessage]:
        driver = self.registry.driver(driver_name)
        return [OpeningLineMessage.declared().agent_message(text=line) for line in driver.instructions] if driver is not None else []
