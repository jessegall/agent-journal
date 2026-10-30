from dataclasses import dataclass
from datetime import datetime, timezone


@dataclass(frozen=True, order=True)
class Moment:
    """A point in time, in UTC, to the microsecond; stored as text of one width, so it sorts as the time does."""

    value: datetime

    def __post_init__(self) -> None:
        if self.value.tzinfo is None:
            raise ValueError(f"a moment needs a time zone; the naive time {self.value.isoformat()} is refused")

    @classmethod
    def parsed(cls, text: str) -> "Moment":
        return cls(datetime.fromisoformat(text).astimezone(timezone.utc))

    @property
    def text(self) -> str:
        return self.value.astimezone(timezone.utc).isoformat(timespec="microseconds")

    def gap_seconds(self, later: "Moment") -> float:
        return (later.value - self.value).total_seconds()
