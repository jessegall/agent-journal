from controllers.types import Todos
from expects import Answered, Given
from features.base import Feature
from features.journal import Journal
from features.kanban.commands import ShiftCard, ShowBoard
from features.kanban.details import KanbanDetails
from resources.types import Todo

NO_CARDS = "To do (0)\n  none\n\nHeld (0)\n  none\n\nDoing (0)\n  none\n\nNeeds you (0)\n  none\n\nDone (0)\n  none"


def lane(key: str, title: str, *cards: dict) -> dict:
    return {"key": key, "title": title, "total": len(cards), "next": "", "cards": list(cards)}


def card(n: int, title: str, lane_key: str, reason: str, targets: list) -> dict:
    return {"n": n, "title": title, "priority": 100, "lane": lane_key, "reason": reason, "plan": None, "assigned": "", "worker": None, "question": 0, "reported": False,
            "targets": targets, "updated": 0.0, "completed": 0.0, "type": "todo", "actions": [], "link": "", "link_label": "", "state": "", "session": "", "repositories": []}


def board(todo: list, held: list, out: str) -> dict:
    return {"lanes": [lane("todo", "To do", *todo), lane("held", "Held", *held), lane("doing", "Doing"), lane("asked", "Needs you"), lane("done", "Done")],
            "agents": [], "plan_hold": None, "out": out}


class KanbanFeature(Feature):
    details = KanbanDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("todo", ShowBoard(), expects=[
            Given((Todos,)) >> Answered(board([], [], NO_CARDS)),
            Given((Todos,), rows=[Todo(n=1, title="Write it"), Todo(n=2, title="Deploy", data={"blocked": "the key is missing"})])
                >> Answered(board([card(1, "Write it", "todo", "", ["held", "doing", "done"])], [card(2, "Deploy", "held", "blocked: the key is missing", ["todo", "done"])],
                                  "To do (1)\n     1  Write it\n\nHeld (1)\n     2  Deploy  [blocked: the key is missing]\n\nDoing (0)\n  none\n\nNeeds you (0)\n  none\n\nDone (0)\n  none")),
        ])
        journal.commands.add("todo", ShiftCard())
