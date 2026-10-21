from dataclasses import dataclass


@dataclass(frozen=True)
class DumpsData:
    """The dumps feature's reading: the dump in hand, the oldest still open, how many of its items wait to be read, and whether a question to the user is open on it."""

    current_dump: int
    waiting: int
    question_open: bool
