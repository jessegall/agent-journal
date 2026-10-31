from enum import StrEnum


class TriggerAction(StrEnum):
    """What a trigger does when its phrase is met: tell the agent, give it an order, or refuse the call."""

    NUDGE = "nudge"
    INSTRUCT = "instruct"
    DENY = "deny"
