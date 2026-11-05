from core.base.change.logged_event import LoggedEvent
from core.modules.memories.commands.fade_memories.fade_memories import FadeMemories
from core.modules.memories.listeners.memory_mark_listener import MemoryMarkListener
from core.modules.memories.models.enums.memory_mark_variant import MemoryMarkVariant
from core.base.change.moved import Moved
from core.modules.memories.models.lifecycles.memory_lifecycle import MemoryLifecycle
from core.modules.memories.models.memory import Memory


class MemoryRemovedMarkListener(MemoryMarkListener[Moved[Memory]]):
    """When a memory is removed, its chat shows a mark naming the memory."""

    name = "memories.removed-mark"
    moves = tuple([MemoryLifecycle.remove])

    def handle(self, event: Moved[Memory], logged: LoggedEvent) -> None:
        if logged.command == FadeMemories.label():
            return
        self.show_memory(logged, MemoryMarkVariant.REMOVED, f"Memory {logged.row_id} removed", row_id=logged.row_id)
