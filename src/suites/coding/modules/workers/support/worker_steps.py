from core.base.query.queries import Queries
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.models.enums.worker_step import WorkerStep
from core.modules.tasks.models.enums.task_state import TaskState
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.brief_points import brief_point_count
from suites.coding.modules.workers.support.worker_job import MERGE_CONFLICT_SOURCE
from suites.coding.modules.workers.support.worker_next_task import WorkerNextTask
from suites.coding.modules.workers.support.worker_nudges import WORKER_MERGE_CONFLICT
from suites.coding.modules.workers.support.worker_phases import WorkerPhases
from suites.coding.modules.workers.support.worker_round import WorkerRound
from suites.coding.modules.workers.support.worker_stop import WorkerStop


class WorkerSteps:
    """Which fixed point of its round a worker is at, read from the rows the journal keeps."""

    def __init__(self, tasks: TaskQuery, worktrees: WorktreeQuery, proofs: ProofQuery, phases: WorkerPhases, next_task: WorkerNextTask, stop: WorkerStop, queries: Queries) -> None:
        self.tasks, self.worktrees, self.proofs, self.phases = tasks, worktrees, proofs, phases
        self.next_task, self.stop, self.queries = next_task, stop, queries

    def round(self, worker_id: int) -> WorkerRound:
        worktree = self.worktrees.worker_worktree(worker_id)
        started = tuple(self.tasks.started_tasks(worker_id))
        ready = tuple(self.tasks.ready_delegated(worker_id))
        conflict = None if worktree is None else self.conflict_line(worktree)
        group = None if worktree is None else self.phases.group(worktree, self.queries.query(Task).find(worktree.task_id))
        return WorkerRound(worker_id, worktree, started, ready, self.next_task.first_ready(ready, started), self.stop.has_open_help_request(worker_id), conflict, group)

    def current_step(self, worker_id: int) -> WorkerStep:
        return self.step(self.round(worker_id))

    def step(self, worker_round: WorkerRound) -> WorkerStep:
        if worker_round.is_asking:
            return WorkerStep.QUESTION
        if worker_round.worktree is None:
            return WorkerStep.BUILD if worker_round.started else WorkerStep.WAIT
        if worker_round.conflict is not None:
            return WorkerStep.CONFLICT
        if self.is_blocked(worker_round):
            return WorkerStep.BLOCKED
        if self.is_delivered(worker_round):
            return WorkerStep.WAIT
        if self.phases.has_open_failure(worker_round.worktree):
            return WorkerStep.FIX
        return self.working_step(worker_round)

    def working_step(self, worker_round: WorkerRound) -> WorkerStep:
        if not worker_round.started or not self.is_proven(worker_round.worktree, worker_round.started[0]):
            return WorkerStep.BUILD
        return WorkerStep.TASK_PROVEN if self.continues_group(worker_round) else WorkerStep.GROUP_END

    def continues_group(self, worker_round: WorkerRound) -> bool:
        return worker_round.following is not None and worker_round.group is not None and self.phases.continues_group(worker_round.group, worker_round.following)

    def is_blocked(self, worker_round: WorkerRound) -> bool:
        worktree = worker_round.worktree
        if worktree.state is not WorktreeState.CUT or worker_round.started or worker_round.following is not None or self.proofs.tests_waiting(worktree.id):
            return False
        return self.queries.query(Task).find(worktree.task_id).state is TaskState.BLOCKED

    def is_delivered(self, worker_round: WorkerRound) -> bool:
        worktree = worker_round.worktree
        if worktree is None:
            return False
        if self.proofs.tests_waiting(worktree.id):
            return True
        if worker_round.started:
            return False
        return worktree.state is WorktreeState.DELIVERED or worker_round.following is None

    def is_proven(self, worktree: Worktree, task: Task) -> bool:
        proved = {proof.point for proof in self.proofs.worktree_proofs(worktree.id).filter(task_id=task.id).all_rows()}
        return all(point in proved for point in range(1, brief_point_count(task.brief) + 1))

    def conflict_line(self, worktree: Worktree) -> AgentLine | None:
        if worktree.state is not WorktreeState.CUT or worktree.delivered_at is None:
            return None
        lines = self.queries.query(AgentLine).filter(session_agent_id=worktree.session_agent_id, source=MERGE_CONFLICT_SOURCE).newest().all_rows()
        return next((line for line in lines if line.nudge.key == WORKER_MERGE_CONFLICT.key and line.creation_timestamp().value >= worktree.delivered_at.value), None)
