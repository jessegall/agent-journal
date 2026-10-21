from dataclasses import dataclass


@dataclass(frozen=True)
class QuestionsReadings:
    """The questions feature's part of the Readings: the questions here still waiting for an answer."""

    open: tuple[int, ...]
