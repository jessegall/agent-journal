from dataclasses import dataclass


@dataclass(frozen=True)
class CheckProgress:
    """A check's run under way: when it started, the tail of what it printed so far, and how far it says it is."""

    time: float
    output: str = ""
    done: int = 0
    total: int = 0
    percent: float | None = None

    @classmethod
    def parsed(cls, data: dict) -> "CheckProgress":
        return cls(**data)
