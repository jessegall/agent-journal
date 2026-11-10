from dataclasses import dataclass

from engine.command.command import Command
from core.modules.helpers.models.enums.usage_limit_mode import UsageLimitMode
from core.modules.helpers.models.enums.usage_limit_window import UsageLimitWindow
from core.modules.helpers.models.usage_limit import UsageLimit


@dataclass(frozen=True)
class SetUsageLimit(Command[UsageLimit]):
    """Sets a person's limit on a program's plan allowance, for a window; a budget counts from what the window
    holds now."""

    program: str
    window: UsageLimitWindow
    mode: UsageLimitMode
    percent: float
