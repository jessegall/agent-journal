from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from engine.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from core.modules.messages.commands.record_parent_report.record_parent_report import RecordParentReport
from core.modules.agents.models.agent import Agent
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.agents.support.report_nudges import EMPTY_REPORT_TEXT
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.messages.commands.send_agent_message.send_agent_message import SendAgentMessage
from core.modules.messages.models.message import Message


class RecordParentReportHandler(Handler[RecordParentReport, Message | None]):
    """Sends a private report to the parent through the message route and ends the reported job. An agent whose
    profile has no report to its parent, such as the merger, sends nothing: its last words only end the job."""

    command = RecordParentReport
    disabled_scopes = [ActorScope]

    def __init__(self, repository: Repository, bus: Bus, rows: EventRows, profiles: ProfileFiles) -> None:
        self.repository, self.bus, self.rows, self.profiles = repository, bus, rows, profiles

    def handle(self, command: RecordParentReport, context: Context) -> Message | None:
        text = command.text or EMPTY_REPORT_TEXT
        message = self.sent_report(command, text, context)
        if command.job_id is not None:
            job = self.rows.required(HelperJob, command.job_id)
            self.repository.save(job.changed(ended_at=context.timestamp, returned=text, report_message_id=message.id if message is not None else None), context)
        return message

    def sent_report(self, command: RecordParentReport, text: str, context: Context) -> Message | None:
        if not self.has_parent_report(command):
            return None
        return self.bus.run(SendAgentMessage(command.parent_id, text, notifies=command.notify_parent, ends_job=command.job_id is not None), Actor(command.agent_id, ActorType.AGENT), environment_id=context.environment_id)

    def has_parent_report(self, command: RecordParentReport) -> bool:
        agent = self.rows.required(Agent, command.agent_id)
        profile = self.profiles.registered(agent.profile)
        return profile is None or profile.has_parent_report
