from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from core.base.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from core.modules.messages.commands.record_parent_report.record_parent_report import RecordParentReport
from core.modules.agents.support.receivers import Receivers
from core.modules.agents.models.agent import Agent
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.agents.support.report_nudges import EMPTY_REPORT_TEXT, PARENT_REPORT, PARENT_REPORT_SOURCE
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.drivers.support.nudger import Nudger
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message


class RecordParentReportHandler(Handler[RecordParentReport, Message]):
    """Saves a private report, ends its job and gives the receiver the message number."""

    command = RecordParentReport
    disabled_scopes = [ActorScope]

    def __init__(self, repository: Repository, nudger: Nudger, receivers: Receivers, rows: EventRows, profiles: ProfileFiles) -> None:
        self.repository, self.nudger, self.receivers, self.rows, self.profiles = repository, nudger, receivers, rows, profiles

    def handle(self, command: RecordParentReport, context: Context) -> Message:
        text = command.text or EMPTY_REPORT_TEXT
        message = self.repository.save(Message(session_agent_id=command.agent_id, creator_id=context.actor.id,
                                               type=MessageType.AGENT, text=text, is_chat_visible=False), context)
        if command.job_id is not None:
            job = self.rows.required(HelperJob, command.job_id)
            self.repository.save(job.changed(ended_at=context.timestamp, returned=text, report_message_id=message.id), context)
        if self.should_notify(command):
            self.notify_receiver(command, message, context)
        return message

    def should_notify(self, command: RecordParentReport) -> bool:
        if not command.tells_receiver:
            return False
        agent = self.rows.required(Agent, command.agent_id)
        profile = self.profiles.registered(agent.profile)
        return profile is None or profile.reports_to_parent

    def notify_receiver(self, command: RecordParentReport, message: Message, context: Context) -> None:
        receiver = self.receivers.receiver(command.parent_id)
        self.nudger.send(receiver.id, PARENT_REPORT, PARENT_REPORT_SOURCE, context, agent=command.agent_id, message=message.id)
