import re
from dataclasses import dataclass

from core.base.duration_error import DurationError
from core.base.duration_unit import DurationUnit
from core.base.timestamp import Timestamp


@dataclass(frozen=True)
class Duration:
    """A positive time span parsed from seconds or a number with a unit."""

    seconds: int

    def __post_init__(self) -> None:
        if self.seconds <= 0:
            raise DurationError.invalid(self.seconds)

    @classmethod
    def parse(cls, text: str) -> "Duration":
        match = re.fullmatch(r"([0-9]+)([a-z]*)", text.strip().lower())
        if match is None:
            raise DurationError.invalid(text)
        try:
            unit = DurationUnit(match.group(2) or DurationUnit.SECOND)
        except ValueError as error:
            raise DurationError.invalid(text) from error
        return cls(int(match.group(1)) * unit.seconds)

    def has_passed(self, start: Timestamp, timestamp: Timestamp) -> bool:
        return start.elapsed_seconds(timestamp) >= self.seconds
