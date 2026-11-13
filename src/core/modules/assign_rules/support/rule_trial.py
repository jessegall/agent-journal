from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.modules.assign_rules.models.support.task_facts import TaskFacts
from core.modules.assign_rules.support.condition_line import ConditionLine


@dataclass(frozen=True)
class ConditionResult:
    """One condition of a tried rule and whether the task meets it."""

    condition: ConditionLine
    matched: bool

    @property
    def line(self) -> str:
        return f"  {self.condition.text}: {'met' if self.matched else 'missed'}"

    def json(self) -> Mapping[str, object]:
        return {"field": self.condition.field.value, "operator": self.condition.operator.value, "value": self.condition.value, "matched": self.matched}


@dataclass(frozen=True)
class RuleTrial:
    """What a rule would say about one task, condition by condition; trying a rule assigns nothing and records nothing."""

    rule_name: str
    task_id: int
    results: tuple[ConditionResult, ...]

    @staticmethod
    def tried(rule_name: str, task_id: int, conditions: Sequence[ConditionLine], facts: TaskFacts) -> "RuleTrial":
        return RuleTrial(rule_name, task_id, tuple(ConditionResult(condition, condition.matches(facts)) for condition in conditions))

    @property
    def matches(self) -> bool:
        return all(result.matched for result in self.results)

    def lines(self) -> Sequence[str]:
        match_text = "matches" if self.matches else "does not match"
        return (f"{self.rule_name} {match_text} task {self.task_id}", *(result.line for result in self.results))

    def json(self) -> Mapping[str, object]:
        return {"task_id": self.task_id, "matches": self.matches, "conditions": [result.json() for result in self.results]}
