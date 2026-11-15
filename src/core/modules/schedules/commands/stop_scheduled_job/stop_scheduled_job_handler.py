from engine.scope.actor_scope import ActorScope
from core.modules.schedules.agent_messages.job_stopped_message import JobStoppedMessage
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from engine.driver.message_sender import MessageSender
from core.modules.schedules.commands.stop_scheduled_job.stop_scheduled_job import StopScheduledJob
from core.modules.schedules.models.scheduled_job import ScheduledJob

LINE_SOURCE = "schedules.stop"


class StopScheduledJobHandler(Handler[StopScheduledJob, ScheduledJob]):
    """Tells the agent to delete the job, since only its own program can; the job stays listed until the
    deletion is seen."""

    command = StopScheduledJob
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, repository: Repository, message_sender: MessageSender) -> None:
        self.queries, self.repository, self.message_sender = queries, repository, message_sender

    def handle(self, command: StopScheduledJob, context: Context) -> ScheduledJob:
        job = self.queries.query(ScheduledJob).find(command.row_id)
        if job.ended_at is not None:
            raise Refusal(f"job {job.job_id} has ended already")
        self.message_sender.send(job.session_agent_id, JobStoppedMessage.declared(), LINE_SOURCE, context, job=job.job_id)
        return self.repository.save(job.changed(stop_requested_at=context.timestamp), context)
