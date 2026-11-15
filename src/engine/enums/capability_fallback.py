from enum import StrEnum


class CapabilityFallback(StrEnum):
    """What a step does instead where a program cannot carry a part of its answer."""

    NONE = "none"
    PROCESS_RUN_REFUSAL = "process-run-refusal"
    TYPING_OR_RESUME = "typing-or-resume"
    WAITING_LINE = "waiting-line"
