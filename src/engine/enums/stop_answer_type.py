from enum import StrEnum


class StopAnswerType(StrEnum):
    """How a stack answers a stop: allowed, refused, a hand-in, a safety rest or the compaction handoff."""

    ALLOWED = "allowed"
    REFUSED = "refused"
    JOB_REPORT = "handover"
    SAFETY_PAUSE = "safety-rest"
    COMPACTION_HANDOFF = "compaction-handoff"
