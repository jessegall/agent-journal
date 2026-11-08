from dataclasses import dataclass
from core.modules.tasks.models.task import Task


@dataclass(frozen=True)
class AvailableWorkAnswer:
    """What the main agent can do next: the task it is handed to work on, the oldest open task ids it can send to a worker
    (at most five are read), the places a worker can start in, and whether it may stop. It may stop when neither is possible, so no setting leaves it stuck."""

    own_task: Task | None
    delegatable: tuple[int, ...]
    free_places: int = 0

    @property
    def may_stop(self) -> bool:
        return self.own_task is None and not self.delegatable
