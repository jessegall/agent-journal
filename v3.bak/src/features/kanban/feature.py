from controllers.types import Todos
from expects import WHEN, Answered, Given, Refused, Unchanged, Updated
from framework.base import Feature
from framework.journal import Journal
from features.kanban.commands import ShiftCard, ShowBoard
from features.kanban.details import KanbanDetails
from resources.kanban import BoardLanes, Card, Lane
from resources.types import Question, Todo, Work

LANES = {"todo": "To do", "held": "Held", "doing": "Doing", "asked": "Needs you", "done": "Done"}
WORKER = {"n": 3, "agent": "", "subagent": False, "parked": False}


def todo(n: int, title: str, **more) -> Todo:
    return Todo(n=n, title=title, **more)


def card(n: int, title: str, lane: str, reason: str = "", **more) -> Card:
    return Card(n, title, 100, lane, reason, **more)


def lanes(**cards: list[Card]) -> BoardLanes:
    return BoardLanes([(Lane(key, title, len(cards.get(key, []))), cards.get(key, [])) for key, title in LANES.items()], [])


class KanbanFeature(Feature):
    details = KanbanDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("todo", ShowBoard(), expects=[
            Given((Todos,)) >> Answered(lanes().shaped()),
            Given((Todos,), rows=[todo(1, "Write it"), todo(2, "Deploy", data={"blocked": "the key is missing"})])
                >> Answered(lanes(todo=[card(1, "Write it", "todo", targets=["held", "doing", "done"])],
                                  held=[card(2, "Deploy", "held", "blocked: the key is missing", targets=["todo", "done"])]).shaped()),
            Given((Todos,), rows=[todo(1, "Write it"), todo(2, "Then ship", data={"after": ["todo:1"]})])
                >> Answered(lanes(todo=[card(1, "Write it", "todo", targets=["held", "doing", "done"])],
                                  held=[card(2, "Then ship", "held", "waits on todo 1")]).shaped()),
            Given((Todos,), rows=[Todo(n=1, title="Long ago", completed=1.0)]) >> Answered(lanes().shaped()),
            Given((Todos,), rows=[todo(1, "Pick a way"), Question(n=3, title="which way?", refs=["todo:1"])])
                >> Answered(lanes(asked=[card(1, "Pick a way", "asked", question=3)]).shaped()),
            Given((Todos,), rows=[todo(1, "Built by a helper", data={"assigned": "helper:3"})])
                >> Answered(lanes(doing=[card(1, "Built by a helper", "doing", "helper 3 has it", assigned="helper:3")]).shaped()),
            Given((Todos,), rows=[todo(1, "Write it"), Work(n=3, title="Building it", data={"todo": 1})])
                >> Answered(lanes(doing=[card(1, "Write it", "doing", worker=WORKER)]).shaped()),
            Given((Todos,), rows=[todo(1, "Write it"), Work(n=3, title="Building it", data={"todo": 1}), Question(n=3, title="which way?", refs=["todo:1"])])
                >> Answered(lanes(asked=[card(1, "Write it", "asked", worker=WORKER, question=3)]).shaped()),
            Given((Todos,), rows=[Todo(n=1, title="Shipped", completed=WHEN - 3600)])
                >> Answered(lanes(done=[card(1, "Shipped", "done", targets=["todo"], completed=WHEN - 3600)]).shaped()),
            Given((Todos,), rows=[todo(1, "Set aside"), Work(n=3, title="The build", data={"todo": 1, "parked": "waiting on the build"})])
                >> Answered(lanes(held=[card(1, "Set aside", "held", "parked: waiting on the build", worker={**WORKER, "parked": True}, targets=["done"])]).shaped()),
            Given((Todos,), rows=[todo(1, "Draw the plan card", data={"assigned": "x1", "hidden": True}), todo(2, "An ordinary to-do handed over", data={"assigned": "x1"})])
                >> Answered(lanes(todo=[card(2, "An ordinary to-do handed over", "todo", assigned="x1", targets=["held", "doing", "done"])]).shaped()),
        ])
        journal.commands.add("todo", ShiftCard(), expects=[
            Given((Todos, 1, "held", "the key is missing"), rows=[todo(1, "Deploy")]) >> Updated(Todo(n=1), blocked="the key is missing"),
            Given((Todos, 1, "todo"), rows=[todo(1, "Deploy", data={"blocked": "the key is missing"})]) >> Updated(Todo(n=1), blocked=""),
            Given((Todos, 1, "done"), rows=[todo(1, "Deploy")]) >> Updated(Todo(n=1), outcome="closed on the board"),
            Given((Todos, 1, "todo", "it came back"), rows=[Todo(n=1, title="Deploy", completed=1.0)]) >> Updated(Todo(n=1), completed=0.0),
            Given((Todos, 1, "done"), rows=[todo(1, "Deploy"), Work(n=3, title="Deploy it", data={"todo": 1})]) >> Refused("work 3 is open on todo 1: the agent ends it with journal work end or parks it with journal work park"),
            Given((Todos, 1, "held"), rows=[todo(1, "Deploy")]) >> Refused('moving todo 1 to held needs --why "<why>"'),
            Given((Todos, 1, "todo"), rows=[Todo(n=1, title="Deploy", completed=1.0)]) >> Refused('moving todo 1 to todo needs --why "<why>"'),
            Given((Todos, 1, "done"), rows=[todo(1, "Then ship", data={"after": ["todo:2"]}), todo(2, "Write it")]) >> Refused("todo 1 waits on todo 2: close that first"),
            Given((Todos, 1, "someday"), rows=[todo(1, "Deploy")]) >> Refused("a lane is one of todo, held, doing, asked, done"),
            Given((Todos, 1, "todo"), rows=[todo(1, "Deploy")]) >> Unchanged(),
            Given((Todos, 1, "done", "", "built it"), rows=[todo(1, "Deploy")]) >> Updated(Todo(n=1), outcome="built it"),
            Given((Todos, 1, "todo", "it came back"), rows=[Todo(n=1, title="Deploy", completed=1.0, data={"blocked": "an old block"})]) >> Updated(Todo(n=1), completed=0.0, blocked=""),
            Given((Todos, 1, "asked"), rows=[todo(1, "Deploy")]) >> Refused('a question puts a card in Needs you: journal question ask "<question>" --set about=todo:1'),
        ])
