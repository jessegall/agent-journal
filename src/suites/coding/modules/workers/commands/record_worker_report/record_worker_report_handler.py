from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from core.modules.drivers.support.nudger import Nudger
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from suites.coding.modules.workers.commands.record_worker_report.record_worker_report import RecordWorkerReport
from suites.coding.modules.workers.support.worker_nudges import WORKER_REPORT

SOURCE = "workers.report"


class RecordWorkerReportHandler(Handler[RecordWorkerReport, Message]):
    """Saves a private report for the main agent and sends it the message number."""

    command = RecordWorkerReport
    disabled_scopes = [ActorScope]

    def __init__(self, repository: Repository, nudger: Nudger) -> None:
        self.repository, self.nudger = repository, nudger

    def handle(self, command: RecordWorkerReport, context: Context) -> Message:
        message = self.repository.save(Message(session_agent_id=command.agent_id, creator_id=context.actor.id,
                                               type=MessageType.AGENT, text=command.text, is_chat_visible=False), context)
        self.nudger.send(command.main_agent_id, WORKER_REPORT, SOURCE, context, worker=command.agent_id, message=message.id)
        return message
