from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.assign_rules.support.board.board_condition import BoardCondition


@dataclass(frozen=True)
class BoardRule:
    """One rule as the Assign tab shows it, with a warning when its target cannot take tasks."""

    id: int
    position: int
    enabled: bool
    target: str
    target_key: str
    target_name: str
    queue_limit: int
    conditions: tuple[BoardCondition, ...]
    warning: str

    @property
    def summary(self) -> str:
        labels = [condition.label for condition in self.conditions]
        return labels[0] if len(labels) == 1 else f"all of: {'; '.join(labels)}"

    def json(self) -> Mapping[str, object]:
        return {"id": self.id, "position": self.position, "enabled": self.enabled, "target": self.target, "target_key": self.target_key, "target_name": self.target_name,
                "queue_limit": self.queue_limit, "conditions": [condition.json() for condition in self.conditions], "summary": self.summary, "warning": self.warning}
