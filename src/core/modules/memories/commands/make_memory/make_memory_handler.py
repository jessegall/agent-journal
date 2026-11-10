from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.memories.models.memory import STARTING_WEIGHT, Memory
from core.modules.memories.models.memory_keyword import MemoryKeyword
from core.modules.memories.commands.make_memory.make_memory import MakeMemory


class MakeMemoryHandler(Handler[MakeMemory, Memory]):
    """Saves a memory at the starting weight unless one is given, with its keywords."""

    command = MakeMemory

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: MakeMemory, context: Context) -> Memory:
        memory = self.repository.save(Memory(task_id=command.task_id,
                                             creator_id=context.actor.id, text=command.text,
                                             weight=STARTING_WEIGHT if command.weight is None else command.weight), context)
        for word in command.keywords:
            self.repository.save(MemoryKeyword(memory_id=memory.id, creator_id=context.actor.id, word=word), context)
        return memory
