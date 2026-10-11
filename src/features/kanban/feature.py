from controllers.types import Todos
from expects import Answered, Given
from features.base import Feature
from features.journal import Journal
from features.kanban.commands import ShiftCard, ShowBoard
from features.kanban.details import KanbanDetails
from features.kanban.shapes import BoardLanes, Card, Lane
from resources.types import Todo

LANES = {"todo": "To do", "held": "Held", "doing": "Doing", "asked": "Needs you", "done": "Done"}


def lanes(**cards: list[Card]) -> BoardLanes:
    return BoardLanes([(Lane(key, title, len(cards.get(key, []))), cards.get(key, [])) for key, title in LANES.items()], [])


class KanbanFeature(Feature):
    details = KanbanDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("todo", ShowBoard(), expects=[
            Given((Todos,)) >> Answered(lanes().shaped()),
            Given((Todos,), rows=[Todo(n=1, title="Write it"), Todo(n=2, title="Deploy", data={"blocked": "the key is missing"})])
                >> Answered(lanes(todo=[Card(1, "Write it", 100, "todo", targets=["held", "doing", "done"])],
                                  held=[Card(2, "Deploy", 100, "held", "blocked: the key is missing", targets=["todo", "done"])]).shaped()),
        ])
        journal.commands.add("todo", ShiftCard())
