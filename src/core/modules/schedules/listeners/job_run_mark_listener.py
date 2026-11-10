from engine.change.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.schedules.models.enums.schedule_mark_type import ScheduleMarkType
from core.modules.schedules.models.enums.schedule_mark_variant import ScheduleMarkVariant
from core.modules.schedules.models.scheduled_job import ScheduledJob
from engine.change.updated import Updated

SCHEDULES_MODULE = "journal.core.schedules"
JOB_RUN_FIELD = "last_run_at"


class JobRunMarkListener(MarkListener[Updated[ScheduledJob]]):
    """Each run of a scheduled job shows a chat mark, which opens on the job's prompt."""

    name = "schedules.job-run-mark"
    module_name = SCHEDULES_MODULE

    def handle(self, event: Updated[ScheduledJob], logged: LoggedEvent) -> None:
        if JOB_RUN_FIELD not in logged.data:
            return
        job = event.row
        self.show(logged, ScheduleMarkType.RUN, ScheduleMarkVariant.RUN, f"Scheduled job {job.job_id} ran", job.session_agent_id, "scheduled_job", job.id, detail=job.prompt)
