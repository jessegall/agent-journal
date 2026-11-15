from enum import StrEnum


class EscalationMarkVariant(StrEnum):
    """What happened to an escalation: it was opened, or its responder answered it."""

    OPENED = "opened"
    ANSWERED = "answered"
