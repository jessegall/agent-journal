from collections.abc import Mapping, Sequence
from dataclasses import asdict, dataclass

from core.modules.tasks.models.task import Task
from core.modules.tasks.support.task_comment import TaskComment
from core.modules.tasks.support.task_conversation import TaskConversation

@dataclass(frozen=True)
class TaskBrief:
    """What an agent reads before it works on a task: its title, its brief, its last comments and its last log
    lines, oldest first, and how many older ones there are with the command that reads them."""

    task: Task
    comments: tuple[TaskComment, ...]
    context: TaskConversation
    log_lines: tuple[str, ...] = ()
    comment_total: int = 0
    log_total: int = 0

    def lines(self) -> Sequence[str]:
        lines = [f"task {self.task.id}: {self.task.title}", self.task.brief or "no brief"]
        older_comments = self.comment_total - len(self.comments)
        if older_comments > 0:
            lines.append(f"{older_comments} older comments: journal task comments {self.task.id}")
        lines += [f"message {comment.message_id}:\n" + "\n".join(f"> {line}" for line in comment.text.splitlines()) +
                  (f"\n{comment.next_command}" if comment.next_command is not None else "") for comment in self.comments] or [f"no comments on task {self.task.id}"]
        older_logs = self.log_total - len(self.log_lines)
        if older_logs > 0:
            lines.append(f"{older_logs} older log lines: journal task-log list --task {self.task.id}")
        return [*lines, *(f"log: {part}" for line in self.log_lines for part in line.splitlines()), *self.context.lines()]

    def json(self) -> Mapping[str, object]:
        return {"id": self.task.id, "title": self.task.title, "brief": self.task.brief, "comments": [asdict(comment) for comment in self.comments], "comment_total": self.comment_total, "log": list(self.log_lines), "log_total": self.log_total, "context": self.context.json()}
