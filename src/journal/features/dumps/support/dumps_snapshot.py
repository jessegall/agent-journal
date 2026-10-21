from dataclasses import dataclass


@dataclass(frozen=True)
class DumpsSnapshot:
    """The dumps feature's reading: the dump in hand, the oldest still open, how many of its items wait to be read, and whether a question to the user is open on it."""

    in_hand: int
    waiting: int
    question_open: bool
