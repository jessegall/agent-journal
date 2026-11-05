from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.modules.tasks.models.task import Task
from core.modules.tasks.support.task_comment import TaskComment

MOST_SHOWN = 5


@dataclass(frozen=True)
class TaskBrief:
    """What an agent reads before it works on a task: its title, its brief, its last comments and its last log
    lines, oldest first, and how many older ones there are with the command that reads them."""

    task: Task
    comments: tuple[TaskComment, ...]
    log_lines: tuple[str, ...] = ()

    def lines(self) -> Sequence[str]:
        lines = [f"task {self.task.id}: {self.task.title}", self.task.brief or "no brief"]
        older_comments = len(self.comments) - MOST_SHOWN
        if older_comments > 0:
            lines.append(f"{older_comments} older comments: journal task comments {self.task.id}")
        lines += [f"message {comment.message_id}: {comment.text}" for comment in self.comments[-MOST_SHOWN:]] or [f"no comments on task {self.task.id}"]
        older_logs = len(self.log_lines) - MOST_SHOWN
        if older_logs > 0:
            lines.append(f"{older_logs} older log lines: journal task-log list --task {self.task.id}")
        return [*lines, *(f"log: {line}" for line in self.log_lines[-MOST_SHOWN:])]

    def json(self) -> Mapping[str, object]:
        return {"id": self.task.id, "title": self.task.title, "brief": self.task.brief, "comments": [{"id": comment.message_id, "text": comment.text} for comment in self.comments], "log": list(self.log_lines)}
