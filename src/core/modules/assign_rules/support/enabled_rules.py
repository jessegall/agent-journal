from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.models.support.task_facts import TaskFacts
from core.modules.assign_rules.support.condition_line import ConditionLine


@dataclass(frozen=True)
class EnabledRules:
    """The enabled rules of an environment in position order, each with its conditions."""

    rules: tuple[AssignRule, ...]
    lines: Mapping[int, tuple[ConditionLine, ...]]

    def matching(self, facts: TaskFacts) -> list[AssignRule]:
        return [rule for rule in self.rules if all(line.matches(facts) for line in self.lines[rule.id])
                and (facts.plan_id is None or any(line.is_plan_condition for line in self.lines[rule.id]))]
