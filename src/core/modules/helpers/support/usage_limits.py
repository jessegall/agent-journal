from collections.abc import Sequence
from datetime import datetime, timezone

from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.helpers.models.enums.usage_limit_mode import UsageLimitMode
from core.modules.helpers.models.enums.usage_limit_window import UsageLimitWindow
from core.modules.helpers.models.usage_limit import UsageLimit
from core.modules.helpers.support.limit_end import LimitEnd
from core.modules.usage.support.plan_window import PlanWindow

HOUR_SECONDS = 3600


class UsageLimits:
    """Reads the limits a person set on a program's plan allowance against the windows its program reported,
    and says when the last limit reached ends: a window's own reset, or the end of the clock hour for an
    hourly limit."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def program_limits(self, program: str) -> tuple[UsageLimit, ...]:
        return tuple(self.queries.query(UsageLimit).filter(program=program).oldest().all_rows())

    @staticmethod
    def matching_window(limit: UsageLimit, windows: Sequence[PlanWindow]) -> PlanWindow | None:
        return next((window for window in windows if window.title == limit.window.plan_title), None)

    @staticmethod
    def marker(limit: UsageLimit, window: PlanWindow, current_epoch: float) -> float:
        return float(int(current_epoch // HOUR_SECONDS)) if limit.window is UsageLimitWindow.HOUR else window.reset_epoch_seconds

    @staticmethod
    def reset_epoch(limit: UsageLimit, window: PlanWindow, current_epoch: float) -> float:
        return (int(current_epoch // HOUR_SECONDS) + 1) * HOUR_SECONDS if limit.window is UsageLimitWindow.HOUR else window.reset_epoch_seconds

    def used(self, limit: UsageLimit, window: PlanWindow, current_epoch: float) -> float:
        if limit.mode is UsageLimitMode.FIXED:
            return window.used_percent
        baseline = limit.baseline_percent if limit.baseline_marker == self.marker(limit, window, current_epoch) else 0.0
        return max(0.0, window.used_percent - min(baseline, window.used_percent))

    def reached_limit_ends(self, program: str, windows: Sequence[PlanWindow], checked_at: Timestamp) -> Timestamp | None:
        end = self.last_reached_end(program, windows, checked_at)
        return end.ends_at if end is not None else None

    def last_reached_end(self, program: str, windows: Sequence[PlanWindow], checked_at: Timestamp) -> LimitEnd | None:
        current_epoch = checked_at.value.timestamp()
        ends = [(self.reset_epoch(limit, window, current_epoch), limit.id) for limit in self.program_limits(program)
                if (window := self.matching_window(limit, windows)) is not None and window.reset_epoch_seconds > current_epoch and self.used(limit, window, current_epoch) >= limit.percent]
        if not ends:
            return None
        reset_epoch, limit_id = max(ends)
        return LimitEnd(Timestamp(datetime.fromtimestamp(reset_epoch, timezone.utc)), limit_id)

    def stale_hourly(self, program: str, windows: Sequence[PlanWindow], checked_at: Timestamp) -> tuple[tuple[UsageLimit, PlanWindow], ...]:
        current_epoch = checked_at.value.timestamp()
        pairs = ((limit, self.matching_window(limit, windows)) for limit in self.program_limits(program) if limit.window is UsageLimitWindow.HOUR and limit.mode is UsageLimitMode.BUDGET)
        return tuple((limit, window) for limit, window in pairs if window is not None and limit.baseline_marker != self.marker(limit, window, current_epoch))
