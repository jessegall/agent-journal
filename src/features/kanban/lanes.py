from dataclasses import dataclass, field

from features.plans.controller import ACTIVE, ENDED
from features.plans.progress import current_phase
from features.plans.resource import PHASE

TODO, HELD, DOING, ASKED, DONE = "todo", "held", "doing", "asked", "done"


@dataclass(frozen=True)
class Lane:
    key: str
    title: str


LANES = (Lane(TODO, "To do"), Lane(HELD, "Held"), Lane(DOING, "Doing"), Lane(ASKED, "Needs you"), Lane(DONE, "Done"))


@dataclass(frozen=True)
class Placement:
    n: int
    title: str
    phase: int
    holds: bool


@dataclass
class Sources:
    todos: object
    works: dict = field(default_factory=dict)
    questions: dict = field(default_factory=dict)
    plans: list = field(default_factory=list)

    def placement(self, todo) -> Placement | None:
        for plan in self.plans:
            if plan.status in ENDED or not any(todo.n in phase[PHASE.todos] for phase in plan.phases):
                continue
            number = next((i for i, phase in enumerate(plan.phases, 1) if todo.n in phase[PHASE.todos]), 0)
            phase = current_phase(plan)
            holds = plan.status != ACTIVE or phase is None or todo.n not in phase[PHASE.todos]
            return Placement(plan.n, plan.title, number, holds)
        return None

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
        return "waits on " + ", ".join(ref.replace(":", " ") for ref in waits)
    placement = sources.holding(todo)
    if placement:
        return f"plan {placement.n} holds it until phase {placement.phase}"
    return ""
