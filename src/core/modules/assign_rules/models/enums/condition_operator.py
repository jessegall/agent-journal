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
