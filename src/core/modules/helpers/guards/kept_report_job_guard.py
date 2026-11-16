from engine.command.context import Context
from engine.errors.refusal import Refusal
from engine.event.changed import Changed
from engine.guard.guard import Guard
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.helpers.support.kept_reports import KeptReports


class KeptReportJobGuard(Guard[Changed[HelperJob]]):
    """A helper whose last report could not be saved takes no next job until its parent or a person tries the
    report again or drops it (doc 1310 section 4.9)."""

    name = "helpers.kept-report-job"

    def __init__(self, reports: KeptReports) -> None:
        self.reports = reports

    def check(self, event: Changed[HelperJob], context: Context) -> None:
        helper_id = event.row.helper_id
        if helper_id is None or (event.old_row is not None and event.old_row.helper_id == helper_id):
            return
        kept = self.reports.kept_job(helper_id)
        if kept is not None and kept.id != event.row.id:
            raise Refusal(f"agent {helper_id}'s report on job {kept.id} was not saved", f"journal unsaved-report retry {helper_id} or journal unsaved-report drop {helper_id}")
