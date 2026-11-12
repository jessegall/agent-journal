from engine.database.kept_rows import KeptRows
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.has_value import HasValue
from engine.query.queries import Queries
from core.modules.drivers.models.helper_job import HelperJob


class HelperJobRows:
    """Shares a helper's jobs across one request, until one of them changes."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def last_job(self, helper_id: int) -> HelperJob | None:
        return self.kept.read("helper_jobs", lambda: self.queries.query(HelperJob).filter(helper_id=helper_id).newest().first(), "helper_id = ?", [helper_id], name="drivers.last_helper_job")

    def has_reviewed(self, helper_id: int, plan_id: int) -> bool:
        return self.kept.read("helper_jobs", lambda: self.queries.query(HelperJob).filter(helper_id=helper_id, review_plan_id=plan_id).exists(),
                              "helper_id = ? AND review_plan_id = ?", [helper_id, plan_id], name="drivers.helper_reviewed")

    def open_job(self, helper_id: int) -> HelperJob | None:
        return self.kept.read("helper_jobs", lambda: self.queries.query(HelperJob).filter(helper_id=helper_id).matching(IsNull("ended_at")).matching(HasValue("started_at")).oldest().first(), "helper_id = ?", [helper_id], name="drivers.open_helper_job")
