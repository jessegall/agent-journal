from dataclasses import dataclass

from engine.model.model import Model
from core.modules.helpers.models.enums.usage_limit_mode import UsageLimitMode
from core.modules.helpers.models.enums.usage_limit_window import UsageLimitWindow


@dataclass(frozen=True, kw_only=True)
class UsageLimit(Model):
    """A user's own limit on a program's plan allowance: the agents of the program halt, as at the plan's
    limit, when the window it counts reaches the percent; a budget counts from the percent the window held
    when it was set (baseline_percent, kept for the window that ended at baseline_marker, or for the clock
    hour of that number)."""

    model_name = "usage_limit"
    cli_name = "usage-limit"
    search_fields = ["program", "window"]

    program: str
    creator_id: int
    window: UsageLimitWindow
    mode: UsageLimitMode
    percent: float
    baseline_percent: float = 0.0
    baseline_marker: float = 0.0
