from dataclasses import dataclass


@dataclass(frozen=True)
class Unwrapped:
    """A stored state with the layers of one state taken out of its chain, and those layers, the innermost first."""

    state: "StoredState"
    taken: tuple["StoredState", ...]
