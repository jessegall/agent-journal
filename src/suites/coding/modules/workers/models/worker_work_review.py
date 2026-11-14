from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.view_model import ViewModel
from suites.coding.modules.workers.models.support.views import WORKER_WORK_REVIEW_SELECT


@dataclass(frozen=True, kw_only=True)
class WorkerWorkReview(EnvironmentScoped, ViewModel):
    shared_rows = True
    cli_name = "worker-work-review"
    view = "worker_work_reviews"
    key = "agent_id"
    select = WORKER_WORK_REVIEW_SELECT

    agent_id: int
    environment_id: int
    status: str
