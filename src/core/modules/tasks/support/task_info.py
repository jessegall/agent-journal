from collections.abc import Mapping, Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class TaskInfo:
    """A task in a few facts for the agent that delegates it: its title, state, priority, complexity and tags, how
    many comments it has, who holds it and what it waits on. It carries no brief and no conversation."""

    id: int
    title: str
    state: str
    priority: int
    complexity: int | None
    tags: tuple[str, ...]
    comment_count: int
    delegated_to: int | None
    waits: tuple[str, ...]

    def lines(self) -> Sequence[str]:
        return [f"task {self.id}: {self.title}", f"state: {self.state}", f"priority: {self.priority}",
                f"complexity: {self.complexity if self.complexity is not None else 'not scored'}", f"tags: {', '.join(self.tags) or 'none'}",
                f"comments: {self.comment_count}", f"delegated to: {f'agent {self.delegated_to}' if self.delegated_to is not None else 'nobody'}",
                f"waits on: {'; '.join(self.waits) or 'nothing'}"]

    def json(self) -> Mapping[str, object]:
        return {"id": self.id, "title": self.title, "state": self.state, "priority": self.priority, "complexity": self.complexity, "tags": list(self.tags),
                "comments": self.comment_count, "delegated_to": self.delegated_to, "waits": list(self.waits)}
