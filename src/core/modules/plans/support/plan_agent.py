import json
from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.plans.support.plan_agent_json_record import PlanAgentJsonRecord


@dataclass(frozen=True)
class PlanAgent:
    """An agent holding or queued for one open task of a plan."""

    id: int
    name: str
    task_id: int
    task_title: str

    @classmethod
    def parsed(cls, row: Mapping[str, int | str]) -> "PlanAgent":
        return cls(int(row["id"]), str(row["name"]), int(row["task_id"]), str(row["task_title"]))

    @classmethod
    def listed(cls, text: str) -> tuple["PlanAgent", ...]:
        return tuple(cls.parsed(row) for row in json.loads(text))

    def json(self) -> PlanAgentJsonRecord:
        return {"id": self.id, "name": self.name, "task_id": self.task_id, "task_title": self.task_title}
