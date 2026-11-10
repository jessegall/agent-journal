from dataclasses import dataclass

from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.view_model import ViewModel
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.support.views import PLAN_CARDS_SELECT


@dataclass(frozen=True, kw_only=True)
class PlanCard(EnvironmentScoped, ViewModel):
    """A plan as the plans window draws it, with its progress and, as a JSON list, the agents holding or
    queued for its open tasks and, as another, its started tasks, and when it or any of its tasks last changed, read from the plan_cards view without its
    brief or reason."""

    cli_name = "plan"
    view = "plan_cards"
    key = "id"
    select = PLAN_CARDS_SELECT

    id: int
    environment_id: int
    title: str
    state: PlanState
    task_count: int
    completed_count: int
    testing_count: int
    current_phase: int
    changed_at: str
    agents: str
    working: str
