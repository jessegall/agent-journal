from dataclasses import dataclass
from typing import ClassVar

from controllers.types import Todos
from engine.events import ResourceEvent
from engine.record import Record
from features.organization.agents import start_role_agent, stop_role_agent
from features.organization.delegation import next_in_line
from features.organization.files import PLAN, organization
from features.parts import Context, Handler
from resources.base import SYSTEM


@dataclass(frozen=True)
class TodoCompleted(ResourceEvent):
    on: ClassVar[str] = "todo.completed"


class StartNextForGlobalRole(Handler):
    def handle(self, context: Context, event: TodoCompleted) -> None:
        todo = context.journal.of("todo").load(event.n)
        role = organization(context.record.root.parent).domain(todo.data["domain"]).role(todo.data["role"]) if todo.data.get("role") else None
        if role:
            for env, waiting in next_in_line(context.record, todo.data["domain"], todo.data["role"], context.record.env, todo.n):
                place = Record(context.record.root, env)
                started = start_role_agent(place, role, waiting.n, f"{waiting.title}\n{waiting.brief}")
                if started:
                    Todos(place, actor=SYSTEM).update(waiting.n, role_environment=started)
        if todo.data.get("role_environment") and not (role and role.cardinality == PLAN):
            stop_role_agent(context.record, todo.data["role_environment"])
