from enum import StrEnum


class EndReason(StrEnum):
    """Why a session of an agent ended."""

    FINISHED = "finished"
    CACHE_PASSED = "cache_passed"
    CONTEXT_LIMIT = "context_limit"
    PERSON_REPLACEMENT = "replaced_by_person"
    DRIVER_CHANGED = "driver_changed"
    LAUNCH_ROTATION = "each_launch"
    UNSTARTED = "never_started"
    CONVERSATION_MISSING = "conversation_missing"
    UNKNOWN = "unknown"
