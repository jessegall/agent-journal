from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.nudge import Nudge
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.messages.commands.send_agent_message.send_agent_message import SendAgentMessage
from suites.coding.modules.workers.commands.send_merger_report.send_merger_report import SendMergerReport


class SendMergerReportHandler(Handler[SendMergerReport, None]):
    """Sends the latest main agent a message of the merger, which the next main agent gets when that one has ended."""

    command = SendMergerReport
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, bus: Bus) -> None:
        self.queries, self.bus = queries, bus

    def handle(self, command: SendMergerReport, context: Context) -> None:
        text = command.text.text if isinstance(command.text, Nudge) else command.text
        main_agent = MainAgentFinder.latest(self.queries)
        if main_agent is not None:
            self.bus.run(SendAgentMessage(main_agent.id, text), context.actor, environment_id=context.environment_id)
