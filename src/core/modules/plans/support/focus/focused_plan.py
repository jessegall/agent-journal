from dataclasses import dataclass

from core.modules.plans.models.enums.focus_source import FocusSource
from core.modules.plans.models.plan import Plan


@dataclass(frozen=True)
class FocusedPlan:
    """The plan an agent works on first, and whether it is the default or the plan the agent named."""

    plan: Plan
    source: FocusSource
