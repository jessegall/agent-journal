from dataclasses import dataclass

from core.modules.plans.models.phase import Phase


@dataclass(frozen=True)
class WorkerStatusPhase:
    """The phase of a worker's current task and how many of its tasks wait for that phase's end."""

    phase: Phase
    tasks_waiting: int

    def listed(self) -> dict[str, object]:
        return {"id": self.phase.id, "title": self.phase.title, "tasks_waiting": self.tasks_waiting}
