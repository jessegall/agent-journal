from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from engine.errors.refusal import Refusal
from engine.scope.actor_scope import ActorScope
from engine.setting.setting_values import SettingValues
from core.modules.agents.support.agent_rows import AgentRows
from suites.coding.modules.workers.commands.decide_behind_check.leave_worker_behind import LeaveWorkerBehind
from suites.coding.modules.workers.commands.merger.require_merger import require_merging_agent
from suites.coding.modules.workers.support.behind_decisions import BehindDecisions
from suites.coding.modules.workers.support.merger_visits import MergerVisits
from suites.coding.modules.workers.support.worker_settings import FORCED_UPDATE_COMMITS

TOO_FAR_BEHIND = "worker {worker} is {count} commits behind, at least {forced}: a folder that far behind is updated, never left"


class LeaveWorkerBehindHandler(Handler[LeaveWorkerBehind, None]):
    """Leaves the worker alone: closes its check as left with the reason and the merger visit, so the handled
    line does not come back; the worker hears nothing, and a later look checks it again only once it fell
    further behind. A worktree at the forced number of commits behind is never left: it is ordered to update."""

    command = LeaveWorkerBehind
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, decisions: BehindDecisions, repository: Repository, visits: MergerVisits, settings: SettingValues) -> None:
        self.agents, self.decisions, self.repository, self.visits, self.settings = agents, decisions, repository, visits, settings

    def handle(self, command: LeaveWorkerBehind, context: Context) -> None:
        deciding = require_merging_agent(self.agents, context)
        _, check = self.decisions.decidable(command.worker_id)
        forced = self.settings.number(FORCED_UPDATE_COMMITS)
        if forced > 0 and check.commits_lagging >= forced:
            raise Refusal(TOO_FAR_BEHIND.format(worker=command.worker_id, count=check.commits_lagging, forced=forced), f"journal merger update {command.worker_id} --why \"<what moved>\"")
        self.repository.save_change(check, check.ignored(deciding.id, command.reason), context)
        self.visits.close_newest(context)
