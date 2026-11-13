from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.modules.assign_rules.models.enums.condition_field import ConditionField
from core.modules.assign_rules.support.board.board_rule import BoardRule
from core.modules.assign_rules.support.board.board_target import BoardTarget


def field_choices() -> list[Mapping[str, object]]:
    return [{"field": field.value, "operators": [{"operator": operator.value, "label": operator.label, "needs_value": operator.needs_value} for operator in field.operators()]}
            for field in ConditionField]


@dataclass(frozen=True)
class AssignBoard:
    """What the Assign tab shows: the targets, the rules in the order where the first match wins, and the
    revision a save names so one made from an older reading is refused."""

    revision: str
    targets: tuple[BoardTarget, ...]
    rules: tuple[BoardRule, ...]

    def lines(self) -> Sequence[str]:
        targets = [f"target {target.label}" for target in self.targets]
        rules = [f"rule {rule.id} ({rule.position}, {'on' if rule.enabled else 'off'}) for {rule.target_name}: {rule.summary}{f' - {rule.warning}' if rule.warning else ''}"
                 f" - {rule.activity.text}" for rule in self.rules]
        return (f"revision {self.revision}", *targets, *rules, "first match wins")

    def json(self) -> Mapping[str, object]:
        return {"revision": self.revision, "targets": [target.json() for target in self.targets], "rules": [rule.json() for rule in self.rules], "fields": field_choices()}
