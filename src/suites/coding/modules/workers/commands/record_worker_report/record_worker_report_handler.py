from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from suites.coding.modules.workers.commands.record_worker_report.record_worker_report import RecordWorkerReport
from suites.coding.modules.workers.support.worker_nudges import WORKER_REPORT

SOURCE = "workers.report"


class RecordWorkerReportHandler(Handler[RecordWorkerReport, Message]):
    """Saves the worker's report as an agent message of the worker, which the chat draws as the worker's, and
    tells its main agent the message's number as a line."""

    command = RecordWorkerReport

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: RecordWorkerReport, context: Context) -> Message:
        message = self.repository.save(Message(environment_id=command.environment_id, agent_id=command.agent_id, creator_id=context.actor.id, type=MessageType.AGENT, text=command.text), context)
        self.repository.save(AgentLine(agent_id=command.main_agent_id, creator_id=context.actor.id, text=WORKER_REPORT.nudge(worker=command.agent_id, message=message.id).text, source=SOURCE), context)
        return message
