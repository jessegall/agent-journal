from dataclasses import dataclass
from typing import ClassVar

from engine.events import ResourceEvent
from features.organization.delegation import next_in_line
from features.parts import Context, Handler


@dataclass(frozen=True)
class TodoCompleted(ResourceEvent):
    on: ClassVar[str] = "todo.completed"


class StartNextForGlobalRole(Handler):
    def handle(self, context: Context, event: TodoCompleted) -> None:
        todo = context.journal.of("todo").load(event.n)
        if todo.data.get("role"):
            next_in_line(context.record, todo.data["domain"], todo.data["role"], context.record.env, todo.n)
