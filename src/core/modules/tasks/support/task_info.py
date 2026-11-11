from collections.abc import Mapping, Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class TaskInfo:
    """A task in a few facts for the agent that delegates it: its title, state, priority, complexity and tags, how
    many comments it has, who it is assigned to and what it waits on. It carries no brief and no conversation."""

    id: int
    title: str
    state: str
    priority: int
    complexity: int | None
    tags: tuple[str, ...]
    comment_count: int
    assigned_actor_id: int | None
    assignee_label: str
    waits: tuple[str, ...]

    def lines(self) -> Sequence[str]:
        return [f"task {self.id}: {self.title}", f"state: {self.state}", f"priority: {self.priority}",
                f"complexity: {self.complexity if self.complexity is not None else 'not scored'}", f"tags: {', '.join(self.tags) or 'none'}",
                f"comments: {self.comment_count}", f"assigned to: {self.assignee_label}",
                f"waits on: {'; '.join(self.waits) or 'nothing'}"]

    def json(self) -> Mapping[str, object]:
        return {"id": self.id, "title": self.title, "state": self.state, "priority": self.priority, "complexity": self.complexity, "tags": list(self.tags),
                "comments": self.comment_count, "assigned_actor_id": self.assigned_actor_id, "waits": list(self.waits)}
