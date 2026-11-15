from enum import StrEnum


class StopAnswerType(StrEnum):
    """How a stack answers a stop: allowed, refused, a hand-in, a safety rest or the compaction handoff."""

    ALLOWED = "allowed"
    REFUSED = "refused"
    HANDOVER = "handover"
    SAFETY_REST = "safety-rest"
    COMPACTION_HANDOFF = "compaction-handoff"
