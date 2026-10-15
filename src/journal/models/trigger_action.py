from enum import StrEnum


class TriggerAction(StrEnum):
    NUDGE = "nudge"
    INSTRUCT = "instruct"
    DENY = "deny"
    SEQUENCE = "sequence"
    """The text names a sequence by its title, started at its first step when the words come up."""
