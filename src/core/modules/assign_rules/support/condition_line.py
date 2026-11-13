from dataclasses import dataclass

from engine.errors.refusal import Refusal
from core.modules.assign_rules.models.assign_rule_condition import AssignRuleCondition
from core.modules.assign_rules.models.enums.condition_field import ConditionField
from core.modules.assign_rules.models.enums.condition_operator import ConditionOperator
from core.modules.assign_rules.models.support.condition_checks import check_condition
from core.modules.assign_rules.models.support.task_facts import TaskFacts
from core.modules.assign_rules.support.rule_limits import RuleLimits
from core.modules.tasks.models.support.task_complexity import TaskComplexity
from core.modules.tasks.models.support.task_priority import PRIORITY_LEVELS
from core.modules.tasks.models.task_tag import TAG_WORD


@dataclass(frozen=True)
class ConditionLine:
    """One condition of a rule as a person writes it, `<field> <operator> <value>`, checked against the
    limits."""

    field: ConditionField
    operator: ConditionOperator
    value: str = ""

    @staticmethod
    def parsed(line: str) -> "ConditionLine":
        words = line.strip().split(maxsplit=2)
        if not words:
            raise Refusal("a condition is empty", "write it as <field> <operator> <value>, such as: complexity minimum 4")
        field = ConditionLine.field_named(words[0])
        operators = field.operators()
        if len(words) == 1 and len(operators) == 1:
            return ConditionLine(field, operators[0])
        if len(words) == 1:
            raise Refusal(f"the condition {field} needs an operator", f"use one of {', '.join(operators)}")
        operator = ConditionLine.operator_named(field, words[1])
        value = words[2].strip() if len(words) == 3 else ""
        ConditionLine.check_value(field, operator, value)
        return ConditionLine(field, operator, value)

    @staticmethod
    def field_named(word: str) -> ConditionField:
        if word not in tuple(ConditionField):
            raise Refusal(f"no condition looks at {word!r}", f"use one of {', '.join(ConditionField)}")
        return ConditionField(word)

    @staticmethod
    def operator_named(field: ConditionField, word: str) -> ConditionOperator:
        operators = field.operators()
        if word not in operators:
            raise Refusal(f"the condition {field} has no operator {word!r}", f"use one of {', '.join(operators)}")
        return ConditionOperator(word)

    @staticmethod
    def check_value(field: ConditionField, operator: ConditionOperator, value: str) -> None:
        if field.is_text:
            RuleLimits.check_phrase(value)
            return
        if not operator.needs_value:
            if value:
                raise Refusal(f"the condition {field} {operator} takes no value", "leave the value out")
            return
        if not value:
            raise Refusal(f"the condition {field} {operator} needs a value")
        match field:
            case ConditionField.COMPLEXITY:
                TaskComplexity(value)
            case ConditionField.PRIORITY if value not in PRIORITY_LEVELS:
                raise Refusal(f"no priority is named {value!r}", f"use one of {', '.join(PRIORITY_LEVELS)}")
            case ConditionField.TAG if not TAG_WORD.fullmatch(value):
                raise Refusal(f"{value!r} is no tag", "a tag uses lower case letters, digits and hyphens")
            case ConditionField.CREATOR | ConditionField.PLACE if not value.isdecimal():
                raise Refusal(f"the condition {field} {operator} needs a number, not {value!r}")

    @property
    def text(self) -> str:
        return " ".join(part for part in (self.field, self.operator, self.value) if part)

    @property
    def label(self) -> str:
        return " ".join(part for part in (self.field, self.operator.label, self.value) if part)

    def matches(self, facts: TaskFacts) -> bool:
        return check_condition(self.field, self.operator, self.value, facts)

    def row(self, rule_id: int) -> AssignRuleCondition:
        return AssignRuleCondition(rule_id=rule_id, field=self.field, operator=self.operator, value=self.value)

    @staticmethod
    def stored(condition: AssignRuleCondition) -> "ConditionLine":
        return ConditionLine(condition.field, condition.operator, condition.value)
