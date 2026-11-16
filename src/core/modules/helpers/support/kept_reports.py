from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from core.modules.drivers.models.enums.job_report_state import JobReportState
from core.modules.drivers.models.helper_job import HelperJob


class KeptReports:
    """The job of a helper whose report could not be saved and whose text is kept on it."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def kept_job(self, helper_id: int) -> HelperJob | None:
        return self.queries.query(HelperJob).filter(helper_id=helper_id, report_state=JobReportState.CAPTURE_FAILED, ended_at=None).newest().first()

    def required_job(self, helper_id: int) -> HelperJob:
        job = self.kept_job(helper_id)
        if job is None:
            raise Refusal(f"agent {helper_id} has no report waiting to be saved", "journal helper show lists its jobs")
        return job
