from dataclasses import dataclass


@dataclass(frozen=True)
class QuestionsData:
    """The questions feature's part of the feature data: the questions here still waiting for an answer."""

    open: tuple[int, ...]
