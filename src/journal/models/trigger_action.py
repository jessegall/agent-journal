from enum import StrEnum


class TriggerAction(StrEnum):
    NUDGE = "nudge"
    INSTRUCT = "instruct"
    DENY = "deny"
    SEQUENCE = "sequence"
