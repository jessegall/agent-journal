from enum import StrEnum


class QuestionType(StrEnum):
    """What a step is asked: a tool call, a stop, a prompt, an observation that asks no permission, or nothing."""

    TOOL_CALL = "tool-call"
    STOP = "stop"
    PROMPT = "prompt"
    OBSERVATION = "observation"
    NONE = "none"
