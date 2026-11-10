from dataclasses import dataclass

from core.modules.plans.support.focus.focused_plan import FocusedPlan
from core.modules.plans.support.focus.plan_work import PlanWork
from core.modules.plans.support.focus.unused_focus import UnusedFocus


@dataclass(frozen=True)
class FocusOverview:
    """The plan focus of one agent, read once: the plan in focus, if any, the work of every started plan,
    oldest first, and a focus the agent named that is not used now."""

    current: FocusedPlan | None
    started: tuple[PlanWork, ...]
    unused: UnusedFocus | None = None

    @property
    def focus_work(self) -> PlanWork | None:
        return None if self.current is None else next(work for work in self.started if work.plan.id == self.current.plan.id)

    def has_ready_task(self, plan_id: int) -> bool:
        return any(work.ready_places for work in self.started if work.plan.id == plan_id)

    def waits_text(self, plan_id: int) -> str:
        return "; ".join(work.unblockers.waits_text() for work in self.started if work.plan.id == plan_id)

    @property
    def remaining(self) -> tuple[PlanWork, ...]:
        return tuple(work for work in self.started if self.current is None or work.plan.id != self.current.plan.id)
