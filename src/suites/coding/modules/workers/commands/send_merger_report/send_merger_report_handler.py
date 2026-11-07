from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.driver.nudge import Nudge
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.agents.support.report_nudges import PARENT_REPORT, PARENT_REPORT_SOURCE
from core.modules.drivers.support.nudger import Nudger
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from suites.coding.modules.workers.commands.send_merger_report.send_merger_report import SendMergerReport


class SendMergerReportHandler(Handler[SendMergerReport, None]):
    """Sends the main agent a message of the merger and a line naming it, which wakes it; an agent's own scope
    would hide a line it writes for another session."""

    command = SendMergerReport
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, repository: Repository, nudger: Nudger) -> None:
        self.queries, self.repository, self.nudger = queries, repository, nudger

    def handle(self, command: SendMergerReport, context: Context) -> None:
        text = command.text.text if isinstance(command.text, Nudge) else command.text
        for main_agent in MainAgentFinder.rows(self.queries):
            message = self.repository.save(Message(session_agent_id=context.actor.id, creator_id=context.actor.id,
                                                   type=MessageType.AGENT, text=text, is_chat_visible=False), context)
            nudge = PARENT_REPORT.nudge(agent=context.actor.id, message=message.id)
            self.nudger.send_nudge(main_agent.id, nudge, PARENT_REPORT_SOURCE, context, wakes_agent=True)
