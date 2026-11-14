from enum import StrEnum


class ConditionOperator(StrEnum):
    """How a rule's condition compares a part of a task with its value."""

    MINIMUM = "minimum"
    MAXIMUM = "maximum"
    EQUALS = "equals"
    IS_SET = "is_set"
    UNSET = "unset"
    HAS_WORD = "has_word"
    LACKS_WORD = "lacks_word"
    HAS = "has"
    LACKS = "lacks"
    IS_PERSON = "is_person"
    IS_MAIN_AGENT = "is_main_agent"
    IS_HELPER = "is_helper"
    IS_AGENT = "is_agent"
    UNPLANNED = "unplanned"
    PLANNED = "planned"
    ANY = "any"

    @property
    def needs_value(self) -> bool:
        return self in (ConditionOperator.MINIMUM, ConditionOperator.MAXIMUM, ConditionOperator.EQUALS, ConditionOperator.HAS_WORD, ConditionOperator.LACKS_WORD,
                        ConditionOperator.HAS, ConditionOperator.LACKS, ConditionOperator.IS_AGENT, ConditionOperator.PLANNED)

    @property
    def label(self) -> str:
        match self:
            case ConditionOperator.MINIMUM:
                return "is at least"
            case ConditionOperator.MAXIMUM:
                return "is at most"
            case ConditionOperator.EQUALS:
                return "is"
            case ConditionOperator.IS_SET:
                return "is set"
            case ConditionOperator.UNSET:
                return "is not set"
            case ConditionOperator.HAS_WORD:
                return "has the word"
            case ConditionOperator.LACKS_WORD:
                return "does not have the word"
            case ConditionOperator.HAS:
                return "has"
            case ConditionOperator.LACKS:
                return "does not have"
            case ConditionOperator.IS_PERSON:
                return "is a person"
            case ConditionOperator.IS_MAIN_AGENT:
                return "is the main agent"
            case ConditionOperator.IS_HELPER:
                return "is a helper"
            case ConditionOperator.IS_AGENT:
                return "is agent"
            case ConditionOperator.UNPLANNED:
                return "is not in a plan"
            case ConditionOperator.PLANNED:
                return "is in plan"
            case _:
                return "task"
