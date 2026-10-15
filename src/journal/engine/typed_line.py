from dataclasses import dataclass


@dataclass(frozen=True)
class TypedLine:
    """A line typed into an agent's terminal, waiting for the prompt hook that proves it arrived."""

    environment_id: int
    line: str
    at: float
    tries: int = 1
