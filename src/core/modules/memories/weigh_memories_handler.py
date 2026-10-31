from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.memories.memory import Memory
from core.modules.memories.weigh_memories import WeighMemories


class WeighMemoriesHandler(Handler[WeighMemories, list[Memory]]):
    """Saves each memory at its new weight; one weight given for several goes to all of them."""

    command = WeighMemories

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: WeighMemories, context: Context) -> list[Memory]:
        if len(command.weights) not in (1, len(command.memory_ids)):
            raise Refusal(f"{len(command.memory_ids)} memories and {len(command.weights)} weights", "give one weight for all, or one for each")
        weights = command.weights * len(command.memory_ids) if len(command.weights) == 1 else command.weights
        memories = self.queries.query(Memory).find_many(command.memory_ids)
        return [self.repository.save(memory.weighed(weight), context) for memory, weight in zip(memories, weights)]
