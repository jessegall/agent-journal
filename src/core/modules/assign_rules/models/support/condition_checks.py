from collections.abc import Sequence

from core.modules.assign_rules.models.enums.condition_field import ConditionField
from core.modules.assign_rules.models.enums.condition_operator import ConditionOperator
from core.modules.assign_rules.models.enums.creator_type import CreatorType
from core.modules.assign_rules.models.support.task_facts import TaskFacts
from core.modules.assign_rules.models.support.task_terms import has_phrase
from core.modules.tasks.models.support.task_complexity import TaskComplexity
from core.modules.tasks.models.support.task_priority import TaskPriority
from core.modules.tasks.support.task_match import has_tags, matches_complexity_range


def check_complexity(operator: ConditionOperator, value: str, facts: TaskFacts) -> bool:
    match operator:
        case ConditionOperator.IS_SET:
            return facts.complexity is not None
        case ConditionOperator.UNSET:
            return facts.complexity is None
        case ConditionOperator.MINIMUM:
            return matches_complexity_range(facts.complexity, TaskComplexity(value), None)
        case ConditionOperator.MAXIMUM:
            return matches_complexity_range(facts.complexity, None, TaskComplexity(value))
        case _:
            return matches_complexity_range(facts.complexity, TaskComplexity(value), TaskComplexity(value))


def check_priority(operator: ConditionOperator, value: str, facts: TaskFacts) -> bool:
    return facts.priority >= TaskPriority(value) if operator is ConditionOperator.MINIMUM else facts.priority == TaskPriority(value)


def check_text(operator: ConditionOperator, value: str, texts: Sequence[str]) -> bool:
    has_match = any(has_phrase(text, value) for text in texts)
    return has_match if operator is ConditionOperator.HAS_WORD else not has_match


def check_tag(operator: ConditionOperator, value: str, facts: TaskFacts) -> bool:
    has_match = has_tags(facts.tags, [value])
    return has_match if operator is ConditionOperator.HAS else not has_match


def check_creator(operator: ConditionOperator, value: str, facts: TaskFacts) -> bool:
    match operator:
        case ConditionOperator.IS_PERSON:
            return facts.creator_type is CreatorType.PERSON
        case ConditionOperator.IS_MAIN_AGENT:
            return facts.creator_type is CreatorType.MAIN_AGENT
        case ConditionOperator.IS_HELPER:
            return facts.creator_type is CreatorType.HELPER
        case _:
            return facts.creator_id == int(value)


def check_place(operator: ConditionOperator, value: str, facts: TaskFacts) -> bool:
    return facts.plan_id is None if operator is ConditionOperator.UNPLANNED else facts.plan_id == int(value)


def check_condition(field: ConditionField, operator: ConditionOperator, value: str, facts: TaskFacts) -> bool:
    match field:
        case ConditionField.COMPLEXITY:
            return check_complexity(operator, value, facts)
        case ConditionField.PRIORITY:
            return check_priority(operator, value, facts)
        case ConditionField.TITLE:
            return check_text(operator, value, [facts.title])
        case ConditionField.BRIEF:
            return check_text(operator, value, [facts.brief])
        case ConditionField.TEXT:
            return check_text(operator, value, [facts.title, facts.brief])
        case ConditionField.TAG:
            return check_tag(operator, value, facts)
        case ConditionField.CREATOR:
            return check_creator(operator, value, facts)
        case ConditionField.PLACE:
            return check_place(operator, value, facts)
        case _:
            return True
