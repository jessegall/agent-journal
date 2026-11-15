from collections.abc import Sequence

from engine.agent.enums.role_group import RoleGroup
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.hook_event_name import HookEventName
from core.modules.memories.agent_messages.memory_line_message import MemoryLineMessage
from core.modules.memories.support.keyword_memories import KeywordMemories

KEYWORD_DELIVERY_KEY = "memories.keyword-delivery"
KEYWORD_EVENTS = [event for event in HookEventName if event is not HookEventName.TICK]


class KeywordDeliveryLines(EventLineSource):
    """When a prompt or a tool use names a keyword of an active memory the agent has not been given since its last
    compaction, the agent is given that memory, at most memories.keyword-limit of them on one hook."""

    key = KEYWORD_DELIVERY_KEY
    events = KEYWORD_EVENTS
    role_group = RoleGroup.PROMPT

    def __init__(self, memories: KeywordMemories) -> None:
        self.memories = memories

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        memory_ids = self.memories.memory_ids(event, agent_id) if event is not None else ()
        return [MemoryLineMessage.declared().agent_message(memory=memory_id) for memory_id in memory_ids]
