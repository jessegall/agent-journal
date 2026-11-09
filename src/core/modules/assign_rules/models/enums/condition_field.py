from enum import StrEnum


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
