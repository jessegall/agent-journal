from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.conditions.minimum import Minimum
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.commands.report_silent_agent.report_silent_agent import ReportSilentAgent, SILENT_AGENT_FAILED, SILENT_FAILURE_SOURCE


class ReportSilentAgentHandler(Handler[ReportSilentAgent, None]):
    """Reports one recovery failure to the main agent until the stopped agent makes progress."""

    command = ReportSilentAgent
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, main_agent_line: MergerInbox) -> None:
        self.queries, self.main_agent_line = queries, main_agent_line

    def handle(self, command: ReportSilentAgent, context: Context) -> None:
        agent = self.queries.query(Agent).find(command.agent_id)
        text = SILENT_AGENT_FAILED.nudge(agent=agent.id, reason=command.reason).text
        notices = self.queries.query(AgentLine).filter(source=SILENT_FAILURE_SOURCE, text=text).matching(Minimum("created_at", command.inactive_at.text))
        if not notices.exists():
            self.main_agent_line.send(text, SILENT_FAILURE_SOURCE, context)
