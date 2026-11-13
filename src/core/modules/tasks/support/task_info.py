from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.modules.assignments.support.assignment_reason import AssignmentReason


@dataclass(frozen=True)
class TaskInfo:
    """A task in a few facts for the agent that delegates it: its title, state, priority, complexity and tags, how
    many comments it has, who it is assigned to and why, and what it waits on. It carries no brief and no
    conversation."""

    id: int
    title: str
    state: str
    priority: int
    complexity: int | None
    tags: tuple[str, ...]
    comment_count: int
    assigned_actor_id: int | None
    assignee_label: str
    assignment_reason: AssignmentReason | None
    waits: tuple[str, ...]

    def lines(self) -> Sequence[str]:
        return [f"task {self.id}: {self.title}", f"state: {self.state}", f"priority: {self.priority}",
                f"complexity: {self.complexity if self.complexity is not None else 'not scored'}", f"tags: {', '.join(self.tags) or 'none'}",
                f"comments: {self.comment_count}", f"assigned to: {self.assignee}",
                f"waits on: {'; '.join(self.waits) or 'nothing'}"]

    @property
    def assignee(self) -> str:
        return self.assignee_label if self.assignment_reason is None else f"{self.assignee_label} {self.assignment_reason.text}"

    def json(self) -> Mapping[str, object]:
        return {"id": self.id, "title": self.title, "state": self.state, "priority": self.priority, "complexity": self.complexity, "tags": list(self.tags),
                "comments": self.comment_count, "assigned_actor_id": self.assigned_actor_id, "assignment_reason": None if self.assignment_reason is None else self.assignment_reason.text, "waits": list(self.waits)}
