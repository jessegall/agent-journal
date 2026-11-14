from dataclasses import dataclass
from datetime import datetime, timezone

from engine.types.type_guards import is_mapping


@dataclass(frozen=True)
class PlanWindow:
    """One window of the plan's allowance as the agent program reported it: its length, the percent used and
    when it starts again."""

    title: str
    used_percent: float
    reset_epoch_seconds: float

    @classmethod
    def reported(cls, title: str, window: object) -> "PlanWindow":
        used = window.get("used_percentage", 0) if is_mapping(window) else 0
        reset = window.get("resets_at", 0) if is_mapping(window) else 0
        return cls(title, float(used) if isinstance(used, int | float) else 0.0, float(reset) if isinstance(reset, int | float) else 0.0)

    @property
    def line(self) -> str:
        reset = datetime.fromtimestamp(self.reset_epoch_seconds, timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
        return f"{self.title} {round(self.used_percent)}% used, starts again {reset}"
