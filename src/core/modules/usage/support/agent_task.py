from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class AgentTask:
    """The task an agent holds."""

    task_id: int
    title: str

    def json(self) -> Mapping[str, object]:
        return {"id": self.task_id, "title": self.title}
