from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.modules.tasks.models.task import Task
from core.modules.tasks.support.task_comment import TaskComment


@dataclass(frozen=True)
class TaskBrief:
    """What an agent reads before it works on a task: its title, its brief, the comments on it and its log lines,
    oldest first."""

    task: Task
    comments: tuple[TaskComment, ...]
    log_lines: tuple[str, ...] = ()

    def lines(self) -> Sequence[str]:
        comment_lines = [f"message {comment.message_id}: {comment.text}" for comment in self.comments] or [f"no comments on task {self.task.id}"]
        return [f"task {self.task.id}: {self.task.title}", self.task.brief or "no brief", *comment_lines, *(f"log: {line}" for line in self.log_lines)]

    def json(self) -> Mapping[str, object]:
        return {"id": self.task.id, "title": self.task.title, "brief": self.task.brief, "comments": [{"id": comment.message_id, "text": comment.text} for comment in self.comments], "log": list(self.log_lines)}
