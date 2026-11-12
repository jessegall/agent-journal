from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from core.modules.agents.support.agent_rows import AgentRows
from suites.coding.modules.workers.commands.decide_behind_check.leave_worker_behind import LeaveWorkerBehind
from suites.coding.modules.workers.commands.merger.require_merger import require_merger_or_main_agent
from suites.coding.modules.workers.support.behind_decisions import BehindDecisions
from suites.coding.modules.workers.support.merger_visits import MergerVisits


class LeaveWorkerBehindHandler(Handler[LeaveWorkerBehind, None]):
    """Leaves the worker alone: closes its check as left with the reason and the merger visit, so the handled
    line does not come back; the worker hears nothing, and a later look checks it again only once it fell
    further behind."""

    command = LeaveWorkerBehind
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, decisions: BehindDecisions, repository: Repository, visits: MergerVisits) -> None:
        self.agents, self.decisions, self.repository, self.visits = agents, decisions, repository, visits

    def handle(self, command: LeaveWorkerBehind, context: Context) -> None:
        deciding = require_merger_or_main_agent(self.agents, context)
        _, check = self.decisions.decidable(command.worker_id)
        self.repository.save_change(check, check.left(deciding.id, command.why), context)
        self.visits.close_newest(context)
