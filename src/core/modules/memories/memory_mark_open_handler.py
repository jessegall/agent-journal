from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.memories.memory_mark import MemoryMark
from core.modules.memories.memory_mark_open import MemoryMarkOpen


class MemoryMarkOpenHandler(Handler[MemoryMarkOpen, MemoryMark]):
    """Saves the agent's open mark; the unique index keeps one open mark per agent."""

    command = MemoryMarkOpen

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: MemoryMarkOpen, context: Context) -> MemoryMark:
        return self.repository.save(MemoryMark(agent_id=command.agent_id, creator_id=context.actor.id, percent=command.percent, opened_at=context.timestamp), context)
