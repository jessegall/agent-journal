from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.view_model import ViewModel
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.support.views import PLAN_CARDS_SELECT


@dataclass(frozen=True, kw_only=True)
class PlanCard(EnvironmentScoped, ViewModel):
    """A plan as the plans window draws it, read from the plan_cards view without its brief or reason: its
    progress, the agents holding or queued for its open tasks and its started tasks as JSON lists, the agent
    that works it, and when it or any of its tasks last changed."""

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
    complexity: float | None = None
    changed_at: str
    agents: str
    working: str
    assignee: str | None = None
