from engine.command.bus import Bus
from engine.event.logged_event import LoggedEvent
from engine.listener.event_rows import EventRows
from engine.module.module_actors import ModuleActors
from engine.query.queries import Queries
from core.modules.drivers.events.agent_compacted import AgentCompacted
from core.modules.drivers.support.context_compactions import ContextCompactions
from core.modules.memories.listeners.memory_mark_listener import MemoryMarkListener
from core.modules.memories.models.enums.memory_mark_type import MemoryMarkType
from core.modules.memories.models.enums.memory_mark_variant import MemoryMarkVariant


class CompactionMarkListener(MemoryMarkListener[AgentCompacted]):
    """When an agent's conversation is compacted, the chat shows a line across it: one line for each compaction,
    also when its program reports the start of the same compaction twice."""

    name = "memories.compaction-mark"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, event_rows: EventRows, compactions: ContextCompactions) -> None:
        super().__init__(bus, actors, queries, event_rows)
        self.compactions = compactions

    def handle(self, event: AgentCompacted, logged: LoggedEvent) -> None:
        agent_id = event.row.session_agent_id
        compaction = self.compactions.newest(agent_id)
        key = f"context-compaction:{compaction.id}" if compaction is not None else None
        self.show(logged, MemoryMarkType.COMPACTION, MemoryMarkVariant.COMPACTED, "Conversation compacted", agent_id, key=key)
