from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.memories.models.memory import Memory
from core.modules.memories.support.mark_closer import MarkCloser
from core.modules.memories.commands.weigh_memories.weigh_memories import WeighMemories


class WeighMemoriesHandler(Handler[WeighMemories, list[Memory]]):
    """Saves each memory at its new weight, one weight given for several going to all of them; keeping a
    weight is an answer too, so the round closes either way."""

    command = WeighMemories

    def __init__(self, queries: Queries, repository: Repository, closer: MarkCloser) -> None:
        self.queries, self.repository, self.closer = queries, repository, closer

    def handle(self, command: WeighMemories, context: Context) -> list[Memory]:
        if len(command.weights) not in (1, len(command.memory_ids)):
            raise Refusal(f"{len(command.memory_ids)} memories and {len(command.weights)} weights", "give one weight for all, or one for each")
        weights = command.weights * len(command.memory_ids) if len(command.weights) == 1 else command.weights
        memories = self.queries.query(Memory).find_many(command.memory_ids)
        saved = [self.repository.update(memory, context, weight=weight) for memory, weight in zip(memories, weights)]
        self.closer.close(context)
        return saved
