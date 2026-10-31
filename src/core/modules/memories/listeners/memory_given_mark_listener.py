from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.memories.listeners.memory_mark_listener import MemoryMarkListener
from core.modules.memories.models.enums.delivery_cause import DeliveryCause
from core.modules.memories.models.enums.memory_mark_type import MemoryMarkType
from core.modules.memories.models.enums.memory_mark_variant import MemoryMarkVariant
from core.modules.memories.models.memory import Memory
from core.modules.memories.models.memory_delivery import MemoryDelivery

REMINDING_CAUSES = (DeliveryCause.KEYWORD, DeliveryCause.DUE)
RULE_TYPES = ("rule", "reminder")


class MemoryGivenMarkListener(MemoryMarkListener):
    """When a memory is given back to an agent by a keyword or because it fell due, or a rule or reminder
    at any time, the chat shows that the agent was reminded, with the memory's words."""

    name = "memories.given-mark"
    event = "memory_delivery.create"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries) -> None:
        super().__init__(bus, actors, queries)

    def handle(self, event: LoggedEvent) -> None:
        delivery = self.queries.query(MemoryDelivery).find(event.row_id)
        memory = self.queries.query(Memory).find(delivery.memory_id)
        if delivery.cause in REMINDING_CAUSES or memory.type in RULE_TYPES:
            environment_id = self.queries.query(Agent).find(delivery.agent_id).environment_id
            self.show(event, MemoryMarkVariant.GIVEN, f"Reminded the agent: {memory.text}", MemoryMarkType.REMINDER, environment_id, delivery.agent_id, row_id=memory.id)
