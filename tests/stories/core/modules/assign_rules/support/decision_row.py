from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class DecisionRow:
    """One decision the rules recorded about a task, as a story reads it from the decision list."""

    id: int
    task_id: int
    rule_id: int | None
    outcome: str
    actor_id: int | None
    reason: str

    @classmethod
    def parsed(cls, row: Mapping[str, object]) -> "DecisionRow":
        return cls(int(str(row["id"])), int(str(row["task_id"])), None if row["rule_id"] is None else int(str(row["rule_id"])), str(row["outcome"]),
                   None if row["actor_id"] is None else int(str(row["actor_id"])), str(row["reason"]))
