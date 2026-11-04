from core.base.actor_type import ActorType
from core.base.agent_role import AgentRole
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.memories.models.memory import Memory
from core.modules.memories.models.memory_keyword import MemoryKeyword
from core.modules.memories.commands.make_memory.make_memory import MakeMemory
from core.modules.memories.models.memory_type import MemoryType


class MakeMemoryHandler(Handler[MakeMemory, Memory]):
    """Saves a memory in the scope asked, or for itself when a helper makes it, at its type's starting weight
    unless one is given, with its keywords."""

    command = MakeMemory

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def is_helper(self, context: Context) -> bool:
        return context.actor.type is ActorType.AGENT and self.queries.query(Agent).find(context.actor.id).role != AgentRole.MAIN

    def handle(self, command: MakeMemory, context: Context) -> Memory:
        types = self.queries.query(MemoryType).filter(name=command.type).page(1, 1).rows
        if not types:
            raise Refusal(f"no memory type {command.type} exists", "journal memory-type list shows them")
        memory = self.repository.save(Memory(environment_id=None if command.project else context.environment_id,
                                             agent_id=context.actor.id if command.personal or self.is_helper(context) else None, task_id=command.task_id,
                                             creator_id=context.actor.id, type=command.type, text=command.text,
                                             weight=types[0].starting_weight if command.weight is None else command.weight), context)
        for word in command.keywords:
            self.repository.save(MemoryKeyword(memory_id=memory.id, creator_id=context.actor.id, word=word), context)
        return memory
