from dataclasses import dataclass
from datetime import datetime, timezone


@dataclass(frozen=True, order=True)
class Timestamp:
    """A point in time, always in UTC and precise to the microsecond."""

    value: datetime

    def __post_init__(self) -> None:
        if self.value.tzinfo is None:
            raise ValueError(f"a timestamp needs a time zone; the naive time {self.value.isoformat()} is refused")

    @classmethod
    def parsed(cls, text: str) -> "Timestamp":
        return cls(datetime.fromisoformat(text).astimezone(timezone.utc))

    @property
    def text(self) -> str:
        return self.value.astimezone(timezone.utc).isoformat(timespec="microseconds")

    def elapsed_seconds(self, later: "Timestamp") -> float:
        return (later.value - self.value).total_seconds()
