from dataclasses import dataclass

from core.modules.plans.support.focus.focused_plan import FocusedPlan
from core.modules.plans.support.focus.plan_work import PlanWork


@dataclass(frozen=True)
class FocusOverview:
    """The plan focus of one agent, read once: the plan in focus, if any, and the work of every started plan,
    oldest first."""

    current: FocusedPlan | None
    started: tuple[PlanWork, ...]

    @property
    def focus_work(self) -> PlanWork | None:
        return None if self.current is None else next(work for work in self.started if work.plan.id == self.current.plan.id)

    @property
    def remaining(self) -> tuple[PlanWork, ...]:
        return tuple(work for work in self.started if self.current is None or work.plan.id != self.current.plan.id)
