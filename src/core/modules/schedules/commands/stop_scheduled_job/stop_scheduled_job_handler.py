from core.modules.schedules.support.schedule_nudges import JOB_STOPPED
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.support.person_check import PersonCheck
from core.modules.drivers.support.nudger import Nudger
from core.modules.schedules.commands.stop_scheduled_job.stop_scheduled_job import StopScheduledJob
from core.modules.schedules.models.scheduled_job import ScheduledJob

LINE_SOURCE = "schedules.stop"


class StopScheduledJobHandler(Handler[StopScheduledJob, ScheduledJob]):
    """Tells the agent to delete the job, since only its own program can; the job stays listed until the
    deletion is seen."""

    command = StopScheduledJob

    def __init__(self, queries: Queries, repository: Repository, nudger: Nudger) -> None:
        self.queries, self.repository, self.nudger = queries, repository, nudger

    def handle(self, command: StopScheduledJob, context: Context) -> ScheduledJob:
        PersonCheck.require(context, "only a person stops an agent's scheduled job")
        job = self.queries.query(ScheduledJob).find(command.row_id)
        if job.ended_at is not None:
            raise Refusal(f"job {job.job_id} has ended already")
        self.nudger.say(job.agent_id, JOB_STOPPED, LINE_SOURCE, context, job=job.job_id)
        return self.repository.save(job.changed(stop_requested_at=context.timestamp), context)
