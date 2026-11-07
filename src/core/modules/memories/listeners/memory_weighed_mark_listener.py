from core.base.change.logged_event import LoggedEvent
from core.modules.memories.commands.fade_memories.fade_memories import FadeMemories
from core.modules.memories.listeners.memory_mark_listener import MemoryMarkListener
from core.modules.memories.models.enums.memory_mark_variant import MemoryMarkVariant
from core.base.change.updated import Updated
from core.modules.memories.models.memory import Memory


class MemoryWeighedMarkListener(MemoryMarkListener[Updated[Memory]]):
    """When a memory's weight is set, its chat shows a mark naming the memory and the new weight; a fade,
    which lowers weights by itself, has its own mark."""

    name = "memories.weighed-mark"

    def handle(self, event: Updated[Memory], logged: LoggedEvent) -> None:
        if "weight" in logged.data and logged.command != FadeMemories.label():
            self.show_memory(logged, MemoryMarkVariant.WEIGHED, f"Memory {logged.row_id}: weight set to {logged.data["weight"][1]}", row_id=logged.row_id)
