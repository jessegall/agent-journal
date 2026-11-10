from enum import StrEnum


class EndReason(StrEnum):
    """Why a session of an agent ended."""

    FINISHED = "finished"
    CACHE_PASSED = "cache_passed"
    CONTEXT_LIMIT = "context_limit"
    REPLACED_BY_PERSON = "replaced_by_person"
    DRIVER_CHANGED = "driver_changed"
    EACH_LAUNCH = "each_launch"
    NEVER_STARTED = "never_started"
    UNKNOWN = "unknown"
