from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class OutlineTask:
    """A task as a plan's outline shows it."""

    id: int
    title: str
    state: str


@dataclass(frozen=True)
class OutlinePhase:
    """A phase as a plan's outline shows it, with its tasks in order."""

    id: int
    title: str
    goal: str
    tasks: tuple[OutlineTask, ...]

    def json(self) -> Mapping[str, object]:
        return {"id": self.id, "title": self.title, "goal": self.goal, "tasks": [{"id": task.id, "title": task.title, "state": task.state} for task in self.tasks]}


@dataclass(frozen=True)
class PlanOutline:
    """A plan's phases and tasks in order, holding only what a window draws of them."""

    plan_id: int
    phases: tuple[OutlinePhase, ...]

    def json(self) -> Mapping[str, object]:
        return {"plan_id": self.plan_id, "phases": [phase.json() for phase in self.phases]}
