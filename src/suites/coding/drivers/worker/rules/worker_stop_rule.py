from suites.coding.support.coding_helper_kind import CodingHelperKind
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
from core.modules.agents.support.agent_rows import AgentRows
from suites.coding.modules.workers.support.worker_compaction import WorkerCompaction
from suites.coding.modules.workers.support.worker_next_task import WorkerNextTask


class WorkerStopRule(DriverRule):
    """A worker may stop with no task, while proof tests wait, while a run or a helper of its own continues,
    while a reader is needed, or between tasks to be compacted. Its run, tests or helper's report restart
    it; otherwise it delivers or says it is stuck."""

    name = "workers.stop-once-delivered"
    hook = HookEventName.STOP

    def __init__(self, tasks: TaskQuery, worktrees: WorktreeQuery, proofs: ProofQuery, processes: ProcessQuery, requests: ReaderRequestQuery, clock: Clock, agents: AgentRows, next_task: WorkerNextTask, compaction: WorkerCompaction) -> None:
        self.next_task = next_task
        self.compaction = compaction
        self.tasks, self.worktrees, self.proofs, self.processes = tasks, worktrees, proofs, processes
        self.requests, self.clock, self.agents = requests, clock, agents

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if self.compaction.is_between_tasks(hook.agent_id):
            return RuleAnswer.allowed()
        started = self.tasks.holder(hook.agent_id).started().first()
        task = started if started is not None else self.next_task.following(hook.agent_id)
        worktree = self.worktrees.worker_worktree(hook.agent_id)
        if self.requests.has_active_requests(hook.agent_id, self.clock.timestamp()):
            return RuleAnswer.allowed()
        if task is None:
            blocked = self.tasks.filter(delegated_to=hook.agent_id, state=TaskState.BLOCKED).all_rows()
            return RuleAnswer.with_nudges(*(WORKER_TASK_BLOCKED.nudge(worker=hook.agent_id, task=row.id) for row in blocked))
        if started is None and worktree is not None and self.proofs.tests_waiting(worktree.id):
            return RuleAnswer.allowed()
        if self.processes.agent(hook.agent_id).running().exists() or self.has_running_helper(hook.agent_id):
            return RuleAnswer.allowed()
        return RuleAnswer.refused(WORKER_TASK_STARTED.nudge(task=task.id))

    def has_running_helper(self, agent_id: int) -> bool:
        return bool(self.agents.running(CodingHelperKind.READ_ONLY, agent_id))
