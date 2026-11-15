from enum import StrEnum


class CapabilityPart(StrEnum):
    """A part of an answer a program may or may not carry on an event."""

    REWRITE = "rewrite"
    TOOL_DENIAL = "tool-denial"
    STOP_REFUSAL = "stop-refusal"
    PROMPT_REFUSAL = "prompt-refusal"
    HALT = "halt"
    LINES = "lines"
    WAKE_HOOK = "wake-hook"
    COMPACTION_END = "compaction-end"
