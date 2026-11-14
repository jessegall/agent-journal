from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.modules.assign_rules.support.rule_tasks.rule_task import RuleTask


@dataclass(frozen=True)
class RuleTaskList:
    """The tasks a rule's apply, reassign or give-back reaches: listed first, and changed only once a person
    confirms."""

    rule_id: int
    tasks: tuple[RuleTask, ...]
    is_confirmed: bool

    @property
    def heading(self) -> str:
        if self.is_confirmed:
            return f"rule {self.rule_id}: {len(self.tasks)} tasks changed"
        return f"rule {self.rule_id}: {len(self.tasks)} tasks; nothing changed yet, run it again with --change to change them"

    def lines(self) -> Sequence[str]:
        return [self.heading, *(task.line for task in self.tasks)]

    def json(self) -> Mapping[str, object]:
        return {"rule_id": self.rule_id, "confirmed": self.is_confirmed, "text": self.heading, "tasks": [task.json() for task in self.tasks]}
