from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.conditions.minimum import Minimum
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.commands.report_silent_agent.report_silent_agent import ReportSilentAgent, SILENT_FAILURE_SOURCE


class ReportSilentAgentHandler(Handler[ReportSilentAgent, None]):
    """Reports one recovery failure to the main agent until the stopped agent makes progress."""

    command = ReportSilentAgent
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, main_agent_line: MergerInbox) -> None:
        self.queries, self.main_agent_line = queries, main_agent_line

    def handle(self, command: ReportSilentAgent, context: Context) -> None:
        agent = self.queries.query(Agent).find(command.agent_id)
        text = f"agent:{agent.number} could not resume: {command.reason}. Check its terminal."
        notices = self.queries.query(MergerLine).filter(fallback_source=SILENT_FAILURE_SOURCE, text=text).matching(Minimum("created_at", command.inactive_at.text))
        if not notices.exists():
            self.main_agent_line.send(text, SILENT_FAILURE_SOURCE, context)
