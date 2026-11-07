from dataclasses import dataclass

from core.base.model.view_model import ViewModel
from core.modules.plans.models.support.views import PLAN_EVENT_ROWS_SELECT


@dataclass(frozen=True, kw_only=True)
class PlanEventRow(ViewModel):
    """Something that happened on a task of a plan, made, logged or ended, read from the plan_event_rows view."""

    cli_name = "plan-event"
    view = "plan_event_rows"
    key = "event_key"
    select = PLAN_EVENT_ROWS_SELECT

    plan_id: int
    event_key: str
    time: str
    event_type: str
    task_id: int
    title: str
    text: str | None
