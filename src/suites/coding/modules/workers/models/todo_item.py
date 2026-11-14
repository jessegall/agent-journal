from dataclasses import dataclass

from engine.model.model import Model
from suites.coding.modules.workers.models.enums.todo_state import TodoState


@dataclass(frozen=True, kw_only=True)
class TodoItem(Model):
    """One item of the to-do list an agent program keeps, in the place the program gave it."""

    model_name = "todo_item"
    cli_name = "todo-item"

    session_agent_id: int
    creator_id: int
    position: int
    text: str
    state: TodoState = TodoState.PENDING
