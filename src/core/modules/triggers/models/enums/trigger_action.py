from enum import StrEnum


class TriggerAction(StrEnum):
    """What a trigger does when its words appear: give text, refuse the call or require a skill."""

    NUDGE = "nudge"
    INSTRUCT = "instruct"
    DENY = "deny"

    SKILL = "skill"
