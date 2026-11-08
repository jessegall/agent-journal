from collections.abc import Sequence
from datetime import datetime, timezone

from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.helpers.models.enums.usage_limit_mode import UsageLimitMode
from core.modules.helpers.models.enums.usage_limit_window import UsageLimitWindow
from core.modules.helpers.models.usage_limit import UsageLimit
from core.modules.usage.support.plan_window import PlanWindow

HOUR_SECONDS = 3600


class UsageLimits:
    """Reads the limits a person set on a program's plan allowance against the windows its program reported, and says when
    the last limit reached ends: a window's own reset, or the end of the clock hour for an hourly limit."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def of(self, program: str) -> tuple[UsageLimit, ...]:
        return tuple(self.queries.query(UsageLimit).filter(program=program).oldest().all_rows())

    @staticmethod
    def window_of(limit: UsageLimit, windows: Sequence[PlanWindow]) -> PlanWindow | None:
        return next((window for window in windows if window.title == limit.window.plan_title), None)

    @staticmethod
    def marker(limit: UsageLimit, window: PlanWindow, now: float) -> float:
        return float(int(now // HOUR_SECONDS)) if limit.window is UsageLimitWindow.HOUR else window.reset_epoch_seconds

    @staticmethod
    def reset_epoch(limit: UsageLimit, window: PlanWindow, now: float) -> float:
        return (int(now // HOUR_SECONDS) + 1) * HOUR_SECONDS if limit.window is UsageLimitWindow.HOUR else window.reset_epoch_seconds

    def used(self, limit: UsageLimit, window: PlanWindow, now: float) -> float:
        """The percent a limit counts now: what the window holds, or for a budget what it holds beyond its baseline."""
        if limit.mode is UsageLimitMode.FIXED:
            return window.used_percent
        baseline = limit.baseline_percent if limit.baseline_marker == self.marker(limit, window, now) else 0.0
        return max(0.0, window.used_percent - min(baseline, window.used_percent))

    def reached_until(self, program: str, windows: Sequence[PlanWindow], checked_at: Timestamp) -> Timestamp | None:
        now = checked_at.value.timestamp()
        ends = [self.reset_epoch(limit, window, now) for limit in self.of(program)
                if (window := self.window_of(limit, windows)) is not None and window.reset_epoch_seconds > now and self.used(limit, window, now) >= limit.percent]
        return Timestamp(datetime.fromtimestamp(max(ends), timezone.utc)) if ends else None

    def stale_hourly(self, program: str, windows: Sequence[PlanWindow], checked_at: Timestamp) -> tuple[tuple[UsageLimit, PlanWindow], ...]:
        """The hourly budgets whose baseline belongs to an earlier hour, with the window they count."""
        now = checked_at.value.timestamp()
        pairs = ((limit, self.window_of(limit, windows)) for limit in self.of(program) if limit.window is UsageLimitWindow.HOUR and limit.mode is UsageLimitMode.BUDGET)
        return tuple((limit, window) for limit, window in pairs if window is not None and limit.baseline_marker != self.marker(limit, window, now))
