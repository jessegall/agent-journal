from engine.event.logged_event import LoggedEvent
from engine.event.updated import Updated
from core.modules.memories.listeners.memory_mark_listener import MemoryMarkListener
from core.modules.memories.models.enums.memory_mark_variant import MemoryMarkVariant
from core.modules.memories.models.memory import Memory


class MemoryEditedMarkListener(MemoryMarkListener[Updated[Memory]]):
    """When a memory's text is changed, its chat shows one mark naming the memory with its new text, and the new
    weight when the same edit set one."""

    name = "memories.edited-mark"

    def handle(self, event: Updated[Memory], logged: LoggedEvent) -> None:
        if "text" not in logged.data:
            return
        weight = f", weight set to {logged.data["weight"][1]}" if "weight" in logged.data else ""
        self.show_memory(logged, MemoryMarkVariant.EDITED, f"Memory {logged.row_id}: edited{weight}", row_id=logged.row_id, detail=str(logged.data["text"][1]))
