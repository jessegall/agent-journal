from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from core.modules.drivers.support.nudger import Nudger
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.commands.queue_worker_tests.record_worker_test import RecordWorkerTest
from suites.coding.modules.workers.models.enums.proof_state import TEST_WAITING_STATES, ProofState
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worktree import Worktree
from core.modules.drivers.support.main_agent_line import MainAgentLine
from suites.coding.modules.workers.support.worker_job import MERGE_CONFLICT_SOURCE
from suites.coding.modules.workers.support.worker_nudges import PROOF_CHECK, WORKER_TESTS_FAILED, WORKER_TESTS_PASSED
from suites.coding.modules.workers.support.worker_task_advance import WorkerTaskAdvance
from suites.coding.modules.workers.models.affected_test import AffectedTest, AffectedTestState

LINE_SOURCE = "workers"



class RecordWorkerTestHandler(Handler[RecordWorkerTest, None]):
    """Records test results and asks for remaining proof checks before recommending a merge."""

    command = RecordWorkerTest
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, repository: Repository, main_agent_line: MainAgentLine, tasks: TaskQuery, advance: WorkerTaskAdvance, nudger: Nudger, rows: EventRows) -> None:
        self.queries, self.repository, self.main_agent_line, self.tasks, self.advance, self.nudger = queries, repository, main_agent_line, tasks, advance, nudger
        self.rows = rows

    def handle(self, command: RecordWorkerTest, context: Context) -> None:
        proof = self.rows.required(Proof, command.proof_id)
        self.repository.save_change(proof, proof.moved(ProofLifecycle.check) if command.passed else proof.moved(ProofLifecycle.short, shortfall=command.output_note), context)
        worktree = self.rows.required(Worktree, proof.worktree_id)
        proofs = tuple(self.queries.query(Proof).filter(worktree_id=worktree.id).all_rows())
        if any(row.state in TEST_WAITING_STATES for row in proofs):
            return
        failed = [row for row in proofs if row.state is ProofState.SHORT]
        if failed:
            self.reopen_work(worktree, failed, context)
            return
        pending = self.queries.query(AffectedTest).filter(worktree_id=worktree.id).all_rows()
        if any(row.state in (AffectedTestState.QUEUED, AffectedTestState.PICKING, AffectedTestState.TESTING) for row in pending):
            return
        self.finish_proofs(worktree, proofs, context)

    def finish(self, worktree: Worktree, context: Context) -> None:
        proofs = tuple(self.queries.query(Proof).filter(worktree_id=worktree.id).all_rows())
        self.finish_proofs(worktree, proofs, context)

    def finish_proofs(self, worktree: Worktree, proofs: tuple[Proof, ...], context: Context) -> None:
        self.complete_tested(proofs, context)
        if worktree.state is WorktreeState.CUT:
            self.start_next(worktree, context)
            return
        waiting = [row for row in proofs if row.state is ProofState.SHOWN]
        if waiting:
            for task_id in sorted({row.task_id for row in waiting}):
                proof_ids = ', '.join(str(row.id) for row in waiting if row.task_id == task_id)
                self.main_agent_line.send(PROOF_CHECK.nudge(worker=worktree.agent_id, task=task_id, proofs=proof_ids).text, LINE_SOURCE, context)
            return
        self.main_agent_line.send(WORKER_TESTS_PASSED.nudge(worker=worktree.agent_id).text, LINE_SOURCE, context)

    def complete_tested(self, proofs: tuple[Proof, ...], context: Context) -> None:
        for task_id in sorted({row.task_id for row in proofs if row.test_command}):
            task = self.rows.required(Task, task_id)
            if task.state is TaskState.TESTING and all(row.state is ProofState.CHECKED for row in proofs if row.task_id == task_id):
                self.repository.save_change(task, task.close(context.timestamp, context.actor, "its tests passed"), context)

    def start_next(self, worktree: Worktree, context: Context) -> None:
        started_task = next(iter(self.tasks.started_tasks(worktree.agent_id)), None)
        if started_task is not None:
            self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.advance, task_id=started_task.id), context)
            return
        following = self.tasks.next_delegated(worktree.agent_id)
        if following is None:
            return
        self.advance.next_task(worktree, following, context)

    def reopen_work(self, worktree: Worktree, failed: list[Proof], context: Context) -> None:
        for task_id in sorted({row.task_id for row in failed}):
            task = self.rows.required(Task, task_id)
            if task.state is TaskState.TESTING:
                self.repository.save_change(task, task.moved(TaskLifecycle.retest), context)
        if worktree.state is WorktreeState.DELIVERED:
            self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.rework), context)
        outputs = ", ".join(str(row.process_id) for row in failed)
        self.nudger.send(worktree.agent_id, WORKER_TESTS_FAILED, MERGE_CONFLICT_SOURCE, context, outputs=outputs)
