from enum import StrEnum


class TriggerAction(StrEnum):
    """What a trigger does when its words appear: give text, refuse the call or require a skill."""

    AGENT_MESSAGE = "nudge"
    INSTRUCT = "instruct"
    DENY = "deny"

    SKILL = "skill"
