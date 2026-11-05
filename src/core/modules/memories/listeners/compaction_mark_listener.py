from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.drivers.models.hook_call import HookCall
from core.modules.memories.listeners.memory_mark_listener import MemoryMarkListener
from core.modules.memories.models.enums.memory_mark_type import MemoryMarkType
from core.modules.memories.models.enums.memory_mark_variant import MemoryMarkVariant
from core.base.change.created import Created


class CompactionMarkListener(MemoryMarkListener[Created[HookCall]]):
    """When an agent's conversation is compacted, the chat shows a line across it."""

    name = "memories.compaction-mark"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries) -> None:
        super().__init__(bus, actors, queries)

    def handle(self, event: Created[HookCall], logged: LoggedEvent) -> None:
        call = event.row
        if call.is_compaction:
            self.show_memory(logged, MemoryMarkVariant.COMPACTED, "Conversation compacted", MemoryMarkType.COMPACTION, call.environment_id, call.agent_id, row_model="")
