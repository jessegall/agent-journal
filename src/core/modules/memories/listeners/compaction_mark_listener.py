from engine.event.logged_event import LoggedEvent
from core.modules.memories.listeners.memory_mark_listener import MemoryMarkListener
from core.modules.memories.models.enums.memory_mark_type import MemoryMarkType
from core.modules.memories.models.enums.memory_mark_variant import MemoryMarkVariant
from core.modules.drivers.events.agent_compacted import AgentCompacted


class CompactionMarkListener(MemoryMarkListener[AgentCompacted]):
    """When an agent's conversation is compacted, the chat shows a line across it."""

    name = "memories.compaction-mark"

    def handle(self, event: AgentCompacted, logged: LoggedEvent) -> None:
        call = event.row
        self.show_memory(logged, MemoryMarkVariant.COMPACTED, "Conversation compacted", MemoryMarkType.COMPACTION, call.session_agent_id, row_model="")
