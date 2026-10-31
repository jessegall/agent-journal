from core.base.change.logged_event import LoggedEvent
from core.modules.memories.commands.fade_memories import FadeMemories
from core.modules.memories.listeners.memory_mark_listener import MemoryMarkListener
from core.modules.memories.models.enums.memory_mark_variant import MemoryMarkVariant


class MemoryWeighedMarkListener(MemoryMarkListener):
    """When a memory's weight is set, its chat shows a mark naming the memory and the new weight; a fade,
    which lowers weights by itself, has its own mark."""

    name = "memories.weighed-mark"
    event = "memory.update"

    def handle(self, event: LoggedEvent) -> None:
        if "weight" in event.data and event.command != FadeMemories.label():
            self.show_memory(event, MemoryMarkVariant.WEIGHED, f"Memory {event.row_id}: weight set to {event.data["weight"][1]}", environment_id=self.memory_environment(event), row_id=event.row_id)
