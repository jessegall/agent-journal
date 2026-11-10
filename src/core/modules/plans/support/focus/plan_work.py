from dataclasses import dataclass

from core.modules.plans.models.plan import Plan
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.support.focus.unblockers import Unblockers


@dataclass(frozen=True)
class PlanWork:
    """What one agent can do for one started plan now: the places of the plan's ready tasks the agent may take,
    and what the plan's unfinished tasks wait on."""

    plan: Plan
    ready_places: tuple[PlanTask, ...]
    unblockers: Unblockers

    @property
    def is_workable(self) -> bool:
        return bool(self.ready_places) or bool(self.unblockers.candidates)
