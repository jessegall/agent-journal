from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.support.condition_line import ConditionLine
from core.modules.assign_rules.support.enabled_rules import EnabledRules


@dataclass(frozen=True)
class EnvironmentRules:
    """Every rule of an environment in position order, each with its conditions, read once for a request."""

    rules: tuple[AssignRule, ...]
    lines: Mapping[int, tuple[ConditionLine, ...]]

    def enabled(self) -> EnabledRules:
        return EnabledRules(tuple(rule for rule in self.rules if rule.enabled), self.lines)
