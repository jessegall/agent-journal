from dataclasses import dataclass


@dataclass(frozen=True)
class SequencesSnapshot:
    """The sequences feature's reading: the run in hand, its sequence and step."""

    sequence_id: int
    step: int
    step_text: str
