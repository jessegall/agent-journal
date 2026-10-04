from controllers.types import Todos
from engine.events.resources import TodoCompleted
from engine.record import Record
from features.agent_sessions.launch import stop_in
from features.organization.agents import start_role_agent
from features.organization.delegation import next_in_line, role_of
from engine.organization import PLAN
from features.parts import Context, Handler
from resources.base import SYSTEM


class StartNextForGlobalRole(Handler):
    def handle(self, context: Context, event: TodoCompleted) -> None:
        todo = context.journal.todos.load(event.n)
        role = role_of(context.record, todo)
        if role:
            for env, waiting in next_in_line(context.record, todo.data["domain"], todo.data["role"], context.record.env, todo.n):
                place = Record(context.record.root, env)
                Todos(place, actor=SYSTEM).unblock(waiting.n)
                started = start_role_agent(place, role, waiting.n, f"{waiting.title}\n{waiting.brief}")
                if started:
                    Todos(place, actor=SYSTEM).update(waiting.n, role_environment=started)
        if todo.data.get("role_environment") and not (role and role.cardinality == PLAN):
            stop_in(context.record, todo.data["role_environment"])
