from features.shaping import shaped
from controllers.types import Todos
from features.format import VIEWER
from engine.record import Record
from features.parts import Command, Context
from resources.base import SYSTEM


class ShowTicketTodos(Command):
    name = "todos"

    def run(self, context: Context, tickets):
        held = []
        for ticket in [t for t in tickets._standing() if t.work_environment and not t.completed]:
            place = Record(context.record.root, ticket.work_environment)
            rows = [shaped(todo, place, VIEWER) for todo in Todos(place, actor=SYSTEM)._standing() if not todo.completed]
            if rows:
                held.append({"ticket": ticket.n, "title": ticket.title, "env": ticket.work_environment, "todos": rows})
        return held
