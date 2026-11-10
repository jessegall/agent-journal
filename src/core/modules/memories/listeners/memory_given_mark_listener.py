from engine.change.logged_event import LoggedEvent
from core.modules.memories.listeners.memory_mark_listener import MemoryMarkListener
from core.modules.memories.models.enums.delivery_cause import DeliveryCause
from core.modules.memories.models.enums.memory_mark_type import MemoryMarkType
from core.modules.memories.models.enums.memory_mark_variant import MemoryMarkVariant
from core.modules.memories.models.memory import Memory
from core.modules.memories.models.memory_delivery import MemoryDelivery
from engine.change.created import Created

REMINDING_CAUSES = [DeliveryCause.KEYWORD]


class MemoryGivenMarkListener(MemoryMarkListener[Created[MemoryDelivery]]):
    """When a memory is given back to an agent by a keyword, the chat shows that the agent was reminded, with
    the memory's words."""

    name = "memories.given-mark"

    def handle(self, event: Created[MemoryDelivery], logged: LoggedEvent) -> None:
        delivery = event.row
        if delivery.cause not in REMINDING_CAUSES:
            return
        memory = self.queries.query(Memory).find(delivery.memory_id)
        self.show_memory(logged, MemoryMarkVariant.GIVEN, f"Reminded the agent: {memory.text}", MemoryMarkType.REMINDER, delivery.session_agent_id, row_id=memory.id)
