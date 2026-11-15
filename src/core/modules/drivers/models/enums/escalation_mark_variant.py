from enum import StrEnum


class EscalationMarkVariant(StrEnum):
    """What happened to an escalation: it was opened, its responder answered it, or it passed to the person."""

    OPENED = "opened"
    ANSWERED = "answered"
    REASSIGNED = "reassigned"
