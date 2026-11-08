from suites.coding.support.coding_helper_kind import CodingHelperKind
from core.modules.drivers.events.stop_denied import StopDenied
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.enums.hook_answer import HookAnswer
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_refusals import WorkerRefusals
from core.modules.drivers.events.stop_allowed import StopAllowed
from core.base.command.context import Context


class WorkerStopResultListener(SaveListener[StopAllowed | StopDenied]):
    """Counts refused worker stops and clears their count when a stop is allowed."""

    name = "workers.stop-refusals"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, worktrees: WorktreeQuery, refusals: WorkerRefusals) -> None:
        self.queries, self.worktrees, self.refusals = queries, worktrees, refusals

    def handle(self, event: StopAllowed | StopDenied, context: Context) -> None:
        call = event.row
        if self.queries.query(Agent).find(call.session_agent_id).role != CodingHelperKind.WORKER:
            return
        worktree = self.worktrees.worker_worktree(call.session_agent_id)
        if worktree is None:
            return
        if call.answer is HookAnswer.REFUSED:
            self.refusals.record(worktree, context)
            return
        self.refusals.clear(worktree, context)
