from dataclasses import dataclass


@dataclass(frozen=True)
class QuestionsSnapshot:
    """The questions feature's part of the Snapshot: the questions here still waiting for an answer."""

    open: tuple[int, ...]
