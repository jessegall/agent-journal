from suites.coding.support.coding_nudges import WORKER_TASK_STARTED
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class WorkerStopRule(DriverRule):
    """A worker stops only once it holds no started task and has no task queued, or while its tests wait, as
    its next task then reaches it; a stop before that names the way to deliver, and a stuck report is the way
    out."""

    name = "workers.stop-once-delivered"
    hook = HookEventName.STOP

    def __init__(self, tasks: TaskQuery, worktrees: WorktreeQuery, proofs: ProofQuery) -> None:
        self.tasks, self.worktrees, self.proofs = tasks, worktrees, proofs

    def answer(self, hook: AgentHook) -> RuleAnswer:
        rows = self.tasks.holder(hook.agent_id).started().page(1, 1).rows
        task = rows[0] if rows else self.tasks.next_delegated(hook.agent_id)
        worktree = self.worktrees.worker_worktree(hook.agent_id)
        if task is None or (not rows and worktree is not None and self.proofs.tests_waiting(worktree.id)):
            return RuleAnswer.allowed()
        return RuleAnswer.refused(WORKER_TASK_STARTED.nudge(task=task.id))
