from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.nudge import Nudge
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.drivers.nudges.cache_keepalive_nudge import CacheKeepaliveNudge
from suites.coding.modules.workers.support.cache_keepalive import CACHE_KEEPALIVE_KEY, CacheKeepalive


class CacheRefreshLines(EventLineSource):
    """The short line that wakes an idle main agent to keep its prompt cache; it asks for no work."""

    key = CACHE_KEEPALIVE_KEY
    events = [HookEventName.TICK]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, keepalive: CacheKeepalive) -> None:
        self.keepalive = keepalive

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        return [CacheKeepaliveNudge.declared().nudge()] if self.keepalive.is_due(agent_id) else []
