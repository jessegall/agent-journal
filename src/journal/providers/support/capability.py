from enum import StrEnum


class Capability(StrEnum):
    """What the viewer may offer for an agent of a program."""

    THOUGHTS = "thoughts"
    CONTEXT_STATUS = "context status"
    STREAMED_TEXT = "streamed text"
    SUBAGENT_TRANSCRIPTS = "subagent transcripts"
    MODEL_CONTROLS = "model controls"
