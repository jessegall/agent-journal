from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.workers.models.enums.todo_state import TodoState


@dataclass(frozen=True)
class RecordTodoList(Command[int]):
    """Records the to-do list an agent program just wrote, in place of the one it had."""

    agent_id: int
    items: tuple[tuple[str, TodoState], ...]
