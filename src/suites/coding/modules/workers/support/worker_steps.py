from suites.coding.modules.workers.models.affected_test import AffectedTest
from suites.coding.modules.workers.models.enums.affected_test_state import AffectedTestState
from engine.query.queries import Queries
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.models.enums.worker_step import WorkerStep
from core.modules.tasks.models.enums.task_state import TaskState
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_job import MERGE_CONFLICT_SOURCE
from suites.coding.modules.workers.support.worker_next_task import WorkerNextTask
from suites.coding.modules.workers.support.worker_nudges import WORKER_MERGE_CONFLICT
from suites.coding.modules.workers.support.worker_round import WorkerRound
from suites.coding.modules.workers.support.worker_staging import WorkerStaging
from suites.coding.modules.workers.support.worker_stop import WorkerStop
from suites.coding.modules.workers.support.work_units import WorkUnits
from suites.coding.modules.workers.support.worktree_runs import WorktreeRuns


class WorkerSteps:
    """Which fixed point of its round a worker is at, read from the rows the journal keeps."""

    def __init__(self, tasks: TaskQuery, worktrees: WorktreeQuery, proofs: ProofQuery, next_task: WorkerNextTask, stop: WorkerStop, queries: Queries, staging: WorkerStaging, units: WorkUnits,
                 runs: WorktreeRuns) -> None:
        self.staging, self.units, self.runs = staging, units, runs
        self.tasks, self.worktrees, self.proofs = tasks, worktrees, proofs
        self.next_task, self.stop, self.queries = next_task, stop, queries

    def round(self, worker_id: int) -> WorkerRound:
        worktree = self.worktrees.worker_worktree(worker_id)
        started = tuple(self.tasks.started_tasks(worker_id))
        ready = tuple(self.tasks.assigned_ready(worker_id))
        conflict = None if worktree is None else self.conflict_line(worktree)
        staging = None if worktree is None else self.staging.read(worktree)
        return WorkerRound(worker_id, worktree, started, ready, self.next_task.first_ready(worker_id, ready, started), self.stop.has_open_help_request(worker_id), conflict, staging)

    def current_step(self, worker_id: int) -> WorkerStep:
        return self.step(self.round(worker_id))

    def step(self, worker_round: WorkerRound) -> WorkerStep:
        if worker_round.is_asking:
            return WorkerStep.QUESTION
        worktree = worker_round.worktree
        if worktree is None:
            return WorkerStep.BUILD if worker_round.started else WorkerStep.WAIT
        if worker_round.conflict is not None:
            return WorkerStep.CONFLICT
        if self.is_blocked(worker_round, worktree):
            return WorkerStep.BLOCKED
        if self.has_open_failure(worktree):
            return WorkerStep.FIX
        if self.is_unit_committed(worker_round, worktree):
            return WorkerStep.WAIT if self.runs.holds_merge(worktree.id) or self.proofs.tests_waiting(worktree.id) else WorkerStep.MERGE_DUE
        if self.is_delivered(worker_round):
            return WorkerStep.WAIT
        return self.working_step(worker_round)

    def is_unit_committed(self, worker_round: WorkerRound, worktree: Worktree) -> bool:
        if worktree.state is not WorktreeState.CUT or worker_round.started:
            return False
        unit = self.units.unit(worker_round.worker_id)
        return unit.has_several_tasks and unit.is_committed

    @staticmethod
    def working_step(worker_round: WorkerRound) -> WorkerStep:
        staging = worker_round.staging
        return WorkerStep.COMMIT if staging is not None and staging.ready else WorkerStep.BUILD

    def has_open_failure(self, worktree: Worktree) -> bool:
        if self.proofs.has_short_proof(worktree.id):
            return True
        first_answer = self.queries.query(AffectedTest).filter(worktree_id=worktree.id).newest().first()
        return first_answer is not None and first_answer.state is AffectedTestState.FAILED

    def is_blocked(self, worker_round: WorkerRound, worktree: Worktree) -> bool:
        if worktree.state is not WorktreeState.CUT or worker_round.started or worker_round.following is not None or self.proofs.tests_waiting(worktree.id):
            return False
        if self.proofs.has_waiting_proofs(worktree.id):
            return False
        return self.queries.query(Task).find(worktree.task_id).state is TaskState.BLOCKED

    def is_delivered(self, worker_round: WorkerRound) -> bool:
        worktree = worker_round.worktree
        if worktree is None:
            return False
        if worktree.state is WorktreeState.DELIVERED:
            return True
        if worker_round.started:
            return False
        return self.proofs.tests_waiting(worktree.id) or worker_round.following is None

    def conflict_line(self, worktree: Worktree) -> AgentLine | None:
        if worktree.state is not WorktreeState.CUT or worktree.delivered_at is None:
            return None
        lines = self.queries.query(AgentLine).filter(session_agent_id=worktree.session_agent_id, source=MERGE_CONFLICT_SOURCE).newest().all_rows()
        return next((line for line in lines if line.nudge.key == WORKER_MERGE_CONFLICT.key and line.creation_timestamp().value >= worktree.delivered_at.value), None)
