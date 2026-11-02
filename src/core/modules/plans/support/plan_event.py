from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class PlanEvent:
    """Something that happened on one of a plan's tasks: its time, its type, the task and what was written."""

    time: str
    event_type: str
    task_id: int
    title: str
    text: str | None = None

    def json(self) -> Mapping[str, object]:
        return {"time": self.time, "event_type": self.event_type, "task_id": self.task_id, "title": self.title, "text": self.text}
