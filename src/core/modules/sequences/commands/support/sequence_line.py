from dataclasses import dataclass


@dataclass(frozen=True)
class SequenceLine:
    """What a sequence command tells the agent: its step, or how the run ended."""

    text: str
