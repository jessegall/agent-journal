from enum import StrEnum


class CapabilityFallback(StrEnum):
    """What a step does instead where a program cannot carry a part of its answer."""

    NONE = "none"
    PROCESS_RUN_REFUSAL = "process-run-refusal"
    WAITING_LINE = "waiting-line"
