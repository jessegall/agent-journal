from dataclasses import dataclass, field

from features.plans.resource import Placement
from resources.base import Ref
from features.kanban.shapes import Lane

TODO, HELD, DOING, ASKED, DONE = "todo", "held", "doing", "asked", "done"


LANES = (Lane(TODO, "To do"), Lane(HELD, "Held"), Lane(DOING, "Doing"), Lane(ASKED, "Needs you"), Lane(DONE, "Done"))


@dataclass
class Sources:
    todos: object
    works: dict = field(default_factory=dict)
    questions: dict = field(default_factory=dict)
    plans: list = field(default_factory=list)

    def placement(self, todo) -> Placement | None:
        return next((found for found in (plan.placement(todo) for plan in self.plans) if found), None)

    def holding(self, todo) -> Placement | None:
        placement = self.placement(todo)
        return placement if placement and placement.holds else None


def lane_of(sources: Sources, todo) -> str:
    if todo.completed:
        return DONE
    if todo.n in sources.questions:
        return ASKED
    if todo.n in sources.works and not sources.works[todo.n].parked:
        return DOING
    if todo.n in sources.works or todo.blocked or sources.todos.waits(todo) or sources.holding(todo):
        return HELD
    return TODO


def reason_of(sources: Sources, todo) -> str:
    work = sources.works.get(todo.n)
    if work and work.parked:
        return f"parked: {work.parked}"
    if todo.blocked:
        return f"blocked: {todo.blocked}"
    waits = sources.todos.waits(todo)
    if waits:
        return "waits on " + ", ".join(Ref.parse(ref).spoken for ref in waits)
    placement = sources.holding(todo)
    if placement:
        return f"plan {placement.n} holds it until phase {placement.phase}"
    return ""
