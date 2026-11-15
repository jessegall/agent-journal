from collections.abc import Sequence

from engine.agent.enums.role_group import RoleGroup
from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.hook_event_name import HookEventName
from engine.time.clock import Clock
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.commands.wake_compacted_agent.wake_compacted_agent import WakeCompactedAgent
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.drivers.support.context_compactions import ContextCompactions

WAKE_WAIT_SECONDS = 10


class CompactionWakeEffect(EventEffect):
    """Wakes an agent that takes tasks when a context change left it at its prompt with no turn running: at once
    after a typed /clear, and at its minute step once a compaction is ten seconds old with no tool call after it,
    so an agent already working again is not told to read the overview. A compaction wakes its agent once, and a
    paused agent never (doc 1310 section 6.4)."""

    key = "drivers.compaction-wake"
    events = [HookEventName.SESSION_START, HookEventName.TICK]
    role_group = RoleGroup.TASK

    def __init__(self, hook_calls: HookCallQuery, compactions: ContextCompactions, clock: Clock, agents: AgentRows) -> None:
        self.hook_calls, self.compactions, self.clock, self.agents = hook_calls, compactions, clock, agents

    def commands_of(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        if self.agents.find(agent_id).is_paused:
            return []
        if event is not None and event.event is HookEventName.SESSION_START:
            return [WakeCompactedAgent(agent_id)] if event.is_clear_start else []
        return [WakeCompactedAgent(agent_id)] if self.is_left_at_its_prompt(agent_id) else []

    def is_left_at_its_prompt(self, agent_id: int) -> bool:
        now = self.clock.timestamp()
        latest = self.hook_calls.latest_turn_call(agent_id)
        if latest is None or not latest.is_compaction_start or latest.creation_timestamp().elapsed_seconds(now) < WAKE_WAIT_SECONDS:
            return False
        return self.hook_calls.is_idle(agent_id, now) and not self.compactions.is_awakened(agent_id)
