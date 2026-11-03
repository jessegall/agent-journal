from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.modules.messages.models.message import Message
from core.modules.tasks.models.task import Task


@dataclass(frozen=True)
class TaskBrief:
    """What an agent reads before it works on a task: its title, its brief and the comments on it, oldest first."""

    task: Task
    comments: tuple[Message, ...]

    def lines(self) -> Sequence[str]:
        comment_lines = [f"message {message.id}: {message.text}" for message in self.comments] or [f"no comments on task {self.task.id}"]
        return [f"task {self.task.id}: {self.task.title}", self.task.brief or "no brief", *comment_lines]

    def json(self) -> Mapping[str, object]:
        return {"id": self.task.id, "title": self.task.title, "brief": self.task.brief, "comments": [{"id": message.id, "text": message.text} for message in self.comments]}
