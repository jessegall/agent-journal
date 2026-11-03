from core.base.clock import Clock
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from suites.coding.support.coding_nudges import WORKER_TASK_STARTED
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.tasks.models.enums.task_state import TaskState
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_nudges import WORKER_TASK_BLOCKED


class WorkerStopRule(DriverRule):
    """A worker may stop with no task, while proof tests wait, while a run continues, or while a reader is
    needed. Its run or tests restart it; otherwise it must deliver or report that it is stuck."""

    name = "workers.stop-once-delivered"
    hook = HookEventName.STOP

    def __init__(self, tasks: TaskQuery, worktrees: WorktreeQuery, proofs: ProofQuery, processes: ProcessQuery, requests: ReaderRequestQuery, clock: Clock) -> None:
        self.tasks, self.worktrees, self.proofs, self.processes = tasks, worktrees, proofs, processes
        self.requests, self.clock = requests, clock

    def answer(self, hook: AgentHook) -> RuleAnswer:
        rows = self.tasks.holder(hook.agent_id).started().page(1, 1).rows
        task = rows[0] if rows else self.tasks.next_delegated(hook.agent_id)
        worktree = self.worktrees.worker_worktree(hook.agent_id)
        if self.requests.has_active_requests(hook.agent_id, self.clock.timestamp()):
            return RuleAnswer.allowed()
        if task is None:
            blocked = self.tasks.filter(delegated_to=hook.agent_id, state=TaskState.BLOCKED).all_rows()
            return RuleAnswer.with_nudges(*(WORKER_TASK_BLOCKED.nudge(worker=hook.agent_id, task=row.id) for row in blocked))
        if not rows and worktree is not None and self.proofs.tests_waiting(worktree.id):
            return RuleAnswer.allowed()
        if self.processes.agent(hook.agent_id).running().exists():
            return RuleAnswer.allowed()
        return RuleAnswer.refused(WORKER_TASK_STARTED.nudge(task=task.id))
