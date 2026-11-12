from engine.database.kept_rows import KeptRows
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.has_value import HasValue
from engine.query.queries import Queries
from engine.query.query import Query
from core.modules.drivers.models.helper_job import HelperJob


class HelperJobRows:
    """Shares a helper's jobs across one request, until one of them changes."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def helper_jobs(self, helper_id: int) -> tuple[HelperJob, ...]:
        return self.kept.read("helper_jobs", lambda: tuple(self.queries.query(HelperJob).filter(helper_id=helper_id).oldest().all_rows()), "helper_id = ?", [helper_id], name="drivers.helper_jobs")

    def open_job(self, helper_id: int) -> HelperJob | None:
        return self.kept.read("helper_jobs", lambda: self.queries.query(HelperJob).filter(helper_id=helper_id).matching(IsNull("ended_at")).matching(HasValue("started_at")).oldest().first(), "helper_id = ?", [helper_id], name="drivers.open_helper_job")

    def open_job_helpers(self) -> Query[HelperJob]:
        """The helpers with an open job that has started, as a column to match an agent's id against."""
        return self.queries.query(HelperJob).where_null("ended_at").where_not_null("started_at").select_columns("helper_id")
