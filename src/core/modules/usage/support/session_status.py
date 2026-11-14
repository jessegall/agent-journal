from dataclasses import dataclass, field

from engine.provider.context_window import ContextWindow
from engine.time.timestamp import Timestamp
from engine.types.type_guards import is_mapping
from core.modules.usage.support.plan_window import PlanWindow

WINDOW_TITLES = {"five_hour": "5 hours", "seven_day": "7 days"}


@dataclass(frozen=True)
class SessionStatus:
    """What an agent program's status line last reported for a session: its model, its effort, the percent of
    its context in use, what the session cost so far and the plan's windows; a session with no report has none
    of them, and a cost no report gave stays unknown, not zero."""

    model: str = ""
    cost_dollars: float | None = None
    windows: tuple[PlanWindow, ...] = ()
    effort: str = ""
    context: ContextWindow = field(default_factory=lambda: ContextWindow(None, None))
    context_limit_tokens: int | None = None

    @classmethod
    def reported(cls, report: object, read_at: Timestamp) -> "SessionStatus":
        if not is_mapping(report):
            return cls(context=ContextWindow(None, None, read_at))
        model, context, cost, limits, effort = report.get("model"), report.get("context_window"), report.get("cost"), report.get("rate_limits"), report.get("effort")
        used = context.get("used_percentage") if is_mapping(context) else None
        spent = cost.get("total_cost_usd") if is_mapping(cost) else None
        windows = tuple(PlanWindow.reported(title, limits.get(key)) for key, title in WINDOW_TITLES.items() if is_mapping(limits.get(key))) if is_mapping(limits) else ()
        return cls(str(model.get("display_name", "")) if is_mapping(model) else "", float(spent) if isinstance(spent, int | float) else None, windows,
                   str(effort.get("level", "")) if is_mapping(effort) else "",
                   ContextWindow(round(used) if isinstance(used, int | float) else None, ContextWindow.number(context, "total_input_tokens"), read_at))

    @property
    def is_read(self) -> bool:
        return self.context.read_at is not None

    @property
    def is_reported(self) -> bool:
        return bool(self.model) or self.context.used_percentage is not None or bool(self.cost_dollars)
