from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.commands.report_safeguards_stop.report_safeguards_stop import ReportSafeguardsStop
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message

REPORT_TEXT = """{agent} stopped twice in a row on an API safeguards error, so it is not woken again.
Details: {details}
Request id: {request}"""
MISSING_REQUEST_ID = "none in the error"


class ReportSafeguardsStopHandler(Handler[ReportSafeguardsStop, None]):
    """Saves the chat message that names the agent, the error's details and its request id."""

    command = ReportSafeguardsStop

    def __init__(self, repository: Repository, agents: AgentRows) -> None:
        self.repository, self.agents = repository, agents

    def handle(self, command: ReportSafeguardsStop, context: Context) -> None:
        text = REPORT_TEXT.format(agent=self.agents.find(command.agent_id).display_name, details=command.details, request=command.request_id or MISSING_REQUEST_ID)
        self.repository.save(Message(creator_id=context.actor.id, type=MessageType.JOURNAL, text=text), context)
