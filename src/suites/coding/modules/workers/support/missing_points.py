from collections.abc import Collection
from dataclasses import dataclass

from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.support.brief_points import brief_point_count


@dataclass(frozen=True)
class MissingPoints:
    """A task and the points of its brief that have no proof."""

    task: Task
    points: tuple[int, ...]

    @classmethod
    def unproved(cls, task: Task, proved_points: Collection[int]) -> "MissingPoints":
        return cls(task, tuple(point for point in range(1, brief_point_count(task.brief) + 1) if point not in proved_points))

    def proof_line(self) -> str:
        return f'journal proof make {self.points[0]} --task {self.task.id} "<file:line, and the test that shows it>"'

    def text(self) -> str:
        if len(self.points) == 1:
            return f"task {self.task.id}: point {self.points[0]} has no proof"
        return f"task {self.task.id}: points {', '.join(str(point) for point in self.points)} have no proof"
