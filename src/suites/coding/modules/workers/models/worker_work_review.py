from dataclasses import dataclass

from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.view_model import ViewModel
from suites.coding.modules.workers.models.support.views import WORKER_WORK_REVIEW_SELECT


@dataclass(frozen=True, kw_only=True)
class WorkerWorkReview(EnvironmentScoped, ViewModel):
    view = "worker_work_reviews"
    key = "agent_id"
    select = WORKER_WORK_REVIEW_SELECT

    agent_id: int
    environment_id: int
    status: str
