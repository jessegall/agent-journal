from enum import StrEnum


class DurationUnit(StrEnum):
    """The units accepted in a command duration."""

    SECOND = "s"
    MINUTE = "m"
    HOUR = "h"
    DAY = "d"

    @property
    def seconds(self) -> int:
        return {self.SECOND: 1, self.MINUTE: 60, self.HOUR: 3600, self.DAY: 86400}[self]
