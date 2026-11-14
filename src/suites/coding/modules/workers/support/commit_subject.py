import re
from collections.abc import Sequence
from dataclasses import dataclass

from core.modules.tasks.models.task import Task

SUBJECT = re.compile(r"^tasks? ([\d, ]+): ")


# The extended regular expression git log --grep takes to find a commit whose subject carries one of these tasks.
def subject_search(task_ids: Sequence[int]) -> str:
    ids = "|".join(str(task_id) for task_id in task_ids)
    return f"^tasks? ([0-9]+, )*({ids})(, [0-9]+)*: "


@dataclass(frozen=True)
class CommitSubject:
    """The first line of a worker's commit: the tasks whose work it carries and the title of the first."""

    tasks: tuple[Task, ...]

    def label(self) -> str:
        ids = ", ".join(str(task.id) for task in self.tasks)
        word = "task" if len(self.tasks) == 1 else "tasks"
        return f"{word} {ids}"

    def text(self) -> str:
        return f"{self.label()}: {self.tasks[0].title}"
