from enum import StrEnum


class UsageLimitWindow(StrEnum):
    """What a user's usage limit counts: the plan's 5-hour window, its 7-day window, or the 5-hour window's
    use within one clock hour."""

    FIVE_HOURS = "5 hours"
    WEEK = "7 days"
    HOUR = "hour"

    @property
    def plan_title(self) -> str:
        return UsageLimitWindow.FIVE_HOURS.value if self is UsageLimitWindow.HOUR else self.value
