from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.conditions.minimum import Minimum
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.support.main_agent_line import MainAgentLine
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.commands.report_silent_agent.report_silent_agent import ReportSilentAgent, SILENT_FAILURE_SOURCE


class ReportSilentAgentHandler(Handler[ReportSilentAgent, None]):
    """Reports one recovery failure until the stopped agent makes progress: a worker's goes through the merger
    inbox, which the merger reads while it is on; any other agent's goes to the main agent, so a main agent or a
    read-only helper never starts the merger."""

    command = ReportSilentAgent
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, inbox: MergerInbox, main_line: MainAgentLine, worktrees: WorktreeQuery) -> None:
        self.queries, self.inbox, self.main_line, self.worktrees = queries, inbox, main_line, worktrees

    def handle(self, command: ReportSilentAgent, context: Context) -> None:
        agent = self.queries.query(Agent).find(command.agent_id)
        text = f"agent:{agent.id} could not resume: {command.reason}. Check its terminal."
        if self.worktrees.newest_worktree(agent.id) is None:
            self.report_to_main_agent(command, text, context)
            return
        notices = self.queries.query(MergerLine).filter(fallback_source=SILENT_FAILURE_SOURCE, text=text).matching(Minimum("created_at", command.inactive_at.text))
        if not notices.exists():
            self.inbox.deliver(MergerLine(text=text, fallback_source=SILENT_FAILURE_SOURCE, worker_id=agent.id), context)

    def report_to_main_agent(self, command: ReportSilentAgent, text: str, context: Context) -> None:
        notices = self.queries.query(AgentLine).filter(source=SILENT_FAILURE_SOURCE, text=text).matching(Minimum("created_at", command.inactive_at.text))
        if not notices.exists():
            self.main_line.send(text, SILENT_FAILURE_SOURCE, context)
