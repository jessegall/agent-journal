from typing import TypedDict


class SequenceInHand(TypedDict):
    """The sequence run an agent's panel shows: the step in hand of how many, its text, what it holds, the row it is about, and how many runs wait under it."""

    n: int
    title: str
    step: int
    steps: int
    text: str
    holds: str
    about: str
    under: int
