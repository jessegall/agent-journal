from core.base.change.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.schedules.models.enums.schedule_mark_type import ScheduleMarkType
from core.modules.schedules.models.enums.schedule_mark_variant import ScheduleMarkVariant
from core.modules.schedules.models.scheduled_job import ScheduledJob

SCHEDULES_MODULE = "journal.core.schedules"
JOB_RUN_FIELD = "last_run_at"


class JobRunMarkListener(MarkListener):
    """Each run of a scheduled job shows a chat mark, which opens on the job's prompt."""

    name = "schedules.job-run-mark"
    event = "scheduled_job.update"
    module_name = SCHEDULES_MODULE

    def handle(self, event: LoggedEvent) -> None:
        if JOB_RUN_FIELD not in event.data:
            return
        job = self.queries.query(ScheduledJob).find(event.row_id)
        self.show(event, ScheduleMarkType.RUN, ScheduleMarkVariant.RUN, f"Scheduled job {job.job_id} ran", job.environment_id, job.agent_id, "scheduled_job", job.id, detail=job.prompt)
