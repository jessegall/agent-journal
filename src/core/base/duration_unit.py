from enum import StrEnum


class DurationUnit(StrEnum):
    """The units accepted in a command duration."""

    SECOND = "s"
    MINUTE = "m"
    HOUR = "h"
    DAY = "d"

    @property
    def seconds(self) -> int:
        return {DurationUnit.SECOND: 1, DurationUnit.MINUTE: 60, DurationUnit.HOUR: 3600, DurationUnit.DAY: 86400}[self]
