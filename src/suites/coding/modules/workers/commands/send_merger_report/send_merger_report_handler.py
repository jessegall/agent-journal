from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.driver.nudge import Nudge
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.messages.commands.send_agent_message.send_agent_message import SendAgentMessage
from suites.coding.modules.workers.commands.send_merger_report.send_merger_report import SendMergerReport


class SendMergerReportHandler(Handler[SendMergerReport, None]):
    """Sends the main agent a message of the merger through the message route, which wakes it."""

    command = SendMergerReport
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, bus: Bus) -> None:
        self.queries, self.bus = queries, bus

    def handle(self, command: SendMergerReport, context: Context) -> None:
        text = command.text.text if isinstance(command.text, Nudge) else command.text
        for main_agent in MainAgentFinder.rows(self.queries):
            self.bus.run(SendAgentMessage(main_agent.id, text), context.actor, environment_id=context.environment_id)
