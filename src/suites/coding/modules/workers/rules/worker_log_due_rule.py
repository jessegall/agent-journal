from suites.coding.support.coding_helper_kind import CodingHelperKind
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.queries import Queries
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_nudges import WORKER_LOG_DUE

LOG_DUE_MINUTES = 30


class WorkerLogDueRule(DriverRule):
    """A worker that has shown no proof for thirty minutes since its worktree or its last proof is told to log
    where it stands."""

    name = "workers.worker-log-due"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [CodingHelperKind.WORKER]

    def __init__(self, worktrees: WorktreeQuery, queries: Queries) -> None:
        self.worktrees, self.queries = worktrees, queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        worktree = self.worktrees.worker_worktree(hook.agent_id)
        if worktree is None:
            return RuleAnswer.allowed()
        latest_proof = self.queries.query(Proof).filter(worktree_id=worktree.id).newest().first()
        latest = latest_proof.creation_timestamp() if latest_proof is not None else worktree.creation_timestamp()
        minutes = latest.elapsed_minutes(hook.timestamp)
        return RuleAnswer.with_nudges(WORKER_LOG_DUE.nudge(minutes=minutes)) if minutes >= LOG_DUE_MINUTES else RuleAnswer.allowed()
