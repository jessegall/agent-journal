from dataclasses import dataclass


@dataclass(frozen=True)
class Turn:
    """One thing the agent wrote in its conversation: its text and where in the transcript it is."""

    line: int
    text: str
    at: float
