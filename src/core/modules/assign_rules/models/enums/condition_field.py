from enum import StrEnum

from core.modules.assign_rules.models.enums.condition_operator import ConditionOperator


class ConditionField(StrEnum):
    """The part of a task a rule's condition looks at."""

    COMPLEXITY = "complexity"
    PRIORITY = "priority"
    TITLE = "title"
    BRIEF = "brief"
    TEXT = "text"
    TAG = "tag"
    CREATOR = "creator"
    PLACE = "place"
    ANY = "any"

    def operators(self) -> tuple[ConditionOperator, ...]:
        match self:
            case ConditionField.COMPLEXITY:
                return ConditionOperator.MINIMUM, ConditionOperator.MAXIMUM, ConditionOperator.EQUALS, ConditionOperator.IS_SET, ConditionOperator.UNSET
            case ConditionField.PRIORITY:
                return ConditionOperator.MINIMUM, ConditionOperator.EQUALS
            case ConditionField.TITLE | ConditionField.BRIEF | ConditionField.TEXT:
                return ConditionOperator.HAS_WORD, ConditionOperator.LACKS_WORD
            case ConditionField.TAG:
                return ConditionOperator.HAS, ConditionOperator.LACKS
            case ConditionField.CREATOR:
                return ConditionOperator.IS_PERSON, ConditionOperator.IS_MAIN_AGENT, ConditionOperator.IS_HELPER, ConditionOperator.IS_AGENT
            case ConditionField.PLACE:
                return ConditionOperator.UNPLANNED, ConditionOperator.PLANNED
            case _:
                return tuple([ConditionOperator.ANY])

    @property
    def is_text(self) -> bool:
        return self in (ConditionField.TITLE, ConditionField.BRIEF, ConditionField.TEXT)
