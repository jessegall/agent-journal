from core.base.agent_role import AgentRole
from core.base.change.change import Change
from core.base.driver.hook_event_name import HookEventName
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.enums.hook_answer import HookAnswer
from core.modules.drivers.models.hook_call import HookCall
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_refusals import WorkerRefusals


class WorkerStopResultListener(SaveListener):
    """Counts refused worker stops and clears their count when a stop is allowed."""

    name = "workers.stop-refusals"
    event = "hook_call.create"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, worktrees: WorktreeQuery, refusals: WorkerRefusals) -> None:
        self.queries, self.worktrees, self.refusals = queries, worktrees, refusals

    def handle(self, change: Change[Model]) -> None:
        call = change.new_row
        if not isinstance(call, HookCall) or call.hook != HookEventName.STOP:
            return
        if self.queries.query(Agent).find(call.agent_id).role is not AgentRole.WORKER:
            return
        worktree = self.worktrees.worker_worktree(call.agent_id)
        if worktree is None:
            return
        if call.answer is HookAnswer.REFUSED:
            self.refusals.record(worktree, call.refusal, change.context)
            return
        self.refusals.clear(worktree, change.context)
