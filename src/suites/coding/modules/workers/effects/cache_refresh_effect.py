from collections.abc import Sequence

from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.drivers.commands.wake_inactive_agent.wake_inactive_agent import WakeInactiveAgent
from suites.coding.modules.workers.support.cache_keepalive import CACHE_KEEPALIVE_KEY, CacheKeepalive


class CacheRefreshEffect(EventEffect):
    """Wakes an idle main agent once its prompt cache has lasted the cold session minutes since its last hook, so the
    cache never expires and the agent does not pay to write its context again."""

    key = CACHE_KEEPALIVE_KEY
    events = [HookEventName.TICK]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, keepalive: CacheKeepalive) -> None:
        self.keepalive = keepalive

    def commands_of(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        return [WakeInactiveAgent(agent_id)] if self.keepalive.is_due(agent_id) else []
