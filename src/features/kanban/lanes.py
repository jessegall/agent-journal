from dataclasses import dataclass, field

from features.plans.resource import Placement
from resources.base import Ref
from features.kanban.shapes import Lane
from features.helpers.resource import held_by_helper

TODO, HELD, DOING, ASKED, DONE = "todo", "held", "doing", "asked", "done"


LANES = (Lane(TODO, "To do"), Lane(HELD, "Held"), Lane(DOING, "Doing"), Lane(ASKED, "Needs you"), Lane(DONE, "Done"))


@dataclass
class Sources:
    todos: object
    works: dict = field(default_factory=dict)
    questions: dict = field(default_factory=dict)
    plans: list = field(default_factory=list)
    waited: dict = field(default_factory=dict)
    laned: dict = field(default_factory=dict)

    def waits(self, todo) -> list[str]:
        """What a to-do waits on, worked out once per board, since the lane, the reason and the moves all ask."""
        if todo.n not in self.waited:
            self.waited[todo.n] = self.todos.waits(todo)
        return self.waited[todo.n]

    def placement(self, todo) -> Placement | None:
        return next((found for found in (plan.placement(todo) for plan in self.plans) if found), None)

    def holding(self, todo) -> Placement | None:
        placement = self.placement(todo)
        return placement if placement and placement.holds else None


def lane_of(sources: Sources, todo) -> str:
    if todo.n not in sources.laned:
        sources.laned[todo.n] = placed_in(sources, todo)
    return sources.laned[todo.n]


def placed_in(sources: Sources, todo) -> str:
    if todo.completed or todo.pending:
        return DONE
    if todo.n in sources.questions:
        return ASKED
    if (todo.n in sources.works and not sources.works[todo.n].parked) or held_by_helper(todo):
        return DOING
    if todo.n in sources.works or todo.blocked or sources.waits(todo) or sources.holding(todo):
        return HELD
    return TODO


def reason_of(sources: Sources, todo) -> str:
    if todo.pending:
        return f"done by {Ref.parse(todo.assigned).spoken}, waits for its merge"
    if held_by_helper(todo):
        return f"{Ref.parse(todo.assigned).spoken} has it"
    work = sources.works.get(todo.n)
    if work and work.parked:
        return f"parked: {work.parked}"
    if todo.blocked:
        return f"blocked: {todo.blocked}"
    waits = sources.waits(todo)
    if waits:
        return "waits on " + ", ".join(Ref.parse(ref).spoken for ref in waits)
    placement = sources.holding(todo)
    if placement:
        return f"plan {placement.n} holds it until phase {placement.phase}"
    return ""
