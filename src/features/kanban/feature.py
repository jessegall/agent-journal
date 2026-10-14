from controllers.types import Todos
from expects import Answered, Given, Refused, Updated
from framework.base import Feature
from framework.journal import Journal
from features.kanban.commands import ShiftCard, ShowBoard
from features.kanban.details import KanbanDetails
from resources.kanban import BoardLanes, Card, Lane
from resources.types import Question, Todo, Work

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
            Given((Todos,), rows=[Todo(n=1, title="Write it"), Todo(n=2, title="Then ship", data={"after": ["todo:1"]})])
                >> Answered(lanes(todo=[Card(1, "Write it", 100, "todo", targets=["held", "doing", "done"])],
                                  held=[Card(2, "Then ship", 100, "held", "waits on todo 1")]).shaped()),
            Given((Todos,), rows=[Todo(n=1, title="Long ago", completed=1.0)]) >> Answered(lanes().shaped()),
            Given((Todos,), rows=[Todo(n=1, title="Pick a way"), Question(n=3, title="which way?", refs=["todo:1"])])
                >> Answered(lanes(asked=[Card(1, "Pick a way", 100, "asked", question=3)]).shaped()),
            Given((Todos,), rows=[Todo(n=1, title="Built by a helper", data={"assigned": "helper:3"})])
                >> Answered(lanes(doing=[Card(1, "Built by a helper", 100, "doing", "helper 3 has it", assigned="helper:3")]).shaped()),
        ])
        journal.commands.add("todo", ShiftCard(), expects=[
            Given((Todos, 1, "held", "the key is missing"), rows=[Todo(n=1, title="Deploy")]) >> Updated(Todo(n=1), blocked="the key is missing"),
            Given((Todos, 1, "todo"), rows=[Todo(n=1, title="Deploy", data={"blocked": "the key is missing"})]) >> Updated(Todo(n=1), blocked=""),
            Given((Todos, 1, "done"), rows=[Todo(n=1, title="Deploy")]) >> Updated(Todo(n=1), outcome="closed on the board"),
            Given((Todos, 1, "todo", "it came back"), rows=[Todo(n=1, title="Deploy", completed=1.0)]) >> Updated(Todo(n=1), completed=0.0),
            Given((Todos, 1, "done"), rows=[Todo(n=1, title="Deploy"), Work(n=3, title="Deploy it", data={"todo": 1})]) >> Refused("work 3 is open on todo 1: the agent ends it with journal work end or parks it with journal work park"),
            Given((Todos, 1, "held"), rows=[Todo(n=1, title="Deploy")]) >> Refused('moving todo 1 to held needs --why "<why>"'),
            Given((Todos, 1, "todo"), rows=[Todo(n=1, title="Deploy", completed=1.0)]) >> Refused('moving todo 1 to todo needs --why "<why>"'),
            Given((Todos, 1, "done"), rows=[Todo(n=1, title="Then ship", data={"after": ["todo:2"]}), Todo(n=2, title="Write it")]) >> Refused("todo 1 waits on todo 2: close that first"),
            Given((Todos, 1, "someday"), rows=[Todo(n=1, title="Deploy")]) >> Refused("a lane is one of todo, held, doing, asked, done"),
        ])
