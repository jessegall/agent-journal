from engine.cli.row_numbers import RowNumbers
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.event_rows import EventRows
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from engine.driver.nudger import Nudger
from core.modules.plans.models.phase import Phase
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
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.support.worker_job import MERGE_CONFLICT_SOURCE
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED
from suites.coding.modules.workers.support.worker_test_failures import WorkerTestFailures
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_nudges import PROOF_CHECK, WORKER_PHASE_TESTS_FAILED, WORKER_TESTS_FAILED, WORKER_TESTS_PASSED
from suites.coding.modules.workers.support.worker_phases import WorkerPhases
from suites.coding.modules.workers.support.worker_task_advance import WorkerTaskAdvance
from suites.coding.modules.workers.models.affected_test import AffectedTest, AffectedTestState
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.support.worker_next_task import WorkerNextTask

LINE_SOURCE = "workers"



class RecordWorkerTestHandler(Handler[RecordWorkerTest, None]):
    """Records test results and asks for remaining proof checks before recommending a merge."""

    command = RecordWorkerTest
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, repository: Repository, main_agent_line: MergerInbox, tasks: TaskQuery, advance: WorkerTaskAdvance, nudger: Nudger, rows: EventRows, phases: WorkerPhases, failures: WorkerTestFailures, settings: SettingValues, next_task: WorkerNextTask, guidance: WorkerGuidance, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.next_task, self.guidance = next_task, guidance
        self.failures, self.settings = failures, settings
        self.queries, self.repository, self.main_agent_line, self.tasks, self.advance, self.nudger = queries, repository, main_agent_line, tasks, advance, nudger
        self.rows, self.phases = rows, phases

    def handle(self, command: RecordWorkerTest, context: Context) -> None:
        proof = self.rows.required(Proof, command.proof_id)
        self.repository.save_change(proof, proof.moved(ProofLifecycle.check) if command.passed else proof.moved(ProofLifecycle.short, shortfall=command.output_note), context)
        worktree = self.rows.required(Worktree, proof.worktree_id)
        self.finish(worktree, context)

    def finish(self, worktree: Worktree, context: Context) -> None:
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

    def finish_proofs(self, worktree: Worktree, proofs: tuple[Proof, ...], context: Context) -> None:
        self.complete_tested(proofs, context)
        if worktree.state is WorktreeState.CUT:
            self.start_next(worktree, context)
            return
        waiting = [row for row in proofs if row.state is ProofState.SHOWN]
        if waiting:
            for task_id in sorted({row.task_id for row in waiting}):
                proof_ids = ', '.join(str(row.id) for row in waiting if row.task_id == task_id)
                self.main_agent_line.send_nudge(PROOF_CHECK.nudge(worker=self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id), task=task_id, proofs=proof_ids), LINE_SOURCE, context)
            return
        self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.mark_tests_passed, tests_passed_at=context.timestamp), context)
        if self.settings.flag(MERGER_ENABLED):
            return
        self.main_agent_line.send_nudge(WORKER_TESTS_PASSED.nudge(worker=self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id)), LINE_SOURCE, context)

    def complete_tested(self, proofs: tuple[Proof, ...], context: Context) -> None:
        task_ids = sorted({row.task_id for row in proofs})
        tasks = self.rows.required_by_id(Task, task_ids)
        self.phases.plans.prepare(task_ids)
        for task_id in task_ids:
            task = tasks[task_id]
            task_proofs = [row for row in proofs if row.task_id == task_id]
            if self.has_passed(task, task_proofs):
                self.repository.save_change(task, task.close(context.timestamp, context.actor, "its tests passed"), context)

    def has_passed(self, task: Task, proofs: list[Proof]) -> bool:
        if self.phases.plans.is_started_plan(task.id):
            return False
        is_closable = self.phases.is_grouped(task) or any(row.test_command for row in proofs)
        return is_closable and task.state is TaskState.TESTING and all(row.state is ProofState.CHECKED for row in proofs)

    def start_next(self, worktree: Worktree, context: Context) -> None:
        started_task = next(iter(self.tasks.started_tasks(worktree.session_agent_id)), None)
        if started_task is not None:
            self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.advance, task_id=started_task.id), context)
            return
        following = self.next_task.following(worktree.session_agent_id)
        if following is None:
            return
        self.advance.next_task(worktree, following, context)

    def reopen_work(self, worktree: Worktree, failed: list[Proof], context: Context) -> None:
        for task_id in sorted({row.task_id for row in failed}):
            self.failures.record_delivery(worktree.session_agent_id, task_id, ", ".join(sorted({row.test_command for row in failed if row.task_id == task_id})), context)
        for task in self.rows.required_by_id(Task, sorted({row.task_id for row in failed})).values():
            if task.state is TaskState.TESTING:
                self.repository.save_change(task, task.moved(TaskLifecycle.retest), context)
        current = self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.rework), context) if worktree.state is WorktreeState.DELIVERED else worktree
        first_task_id = min(row.task_id for row in failed)
        phase = self.phases.phase(self.rows.required(Task, first_task_id))
        if current.task_id != first_task_id:
            current = self.repository.save_change(current, current.moved(WorktreeLifecycle.advance, task_id=first_task_id), context)
        if phase is None:
            outputs = ", ".join(str(row.process_id) for row in failed)
            self.nudger.send(current.session_agent_id, WORKER_TESTS_FAILED, MERGE_CONFLICT_SOURCE, context, outputs=outputs, line=self.guidance.line(current.session_agent_id))
            return
        outputs = ", ".join(str(row.process_id) for row in failed)
        self.send_phase_failures(current, phase, outputs, context)

    def send_phase_failures(self, worktree: Worktree, phase: Phase, outputs: str, context: Context) -> None:
        self.nudger.send(worktree.session_agent_id, WORKER_PHASE_TESTS_FAILED, MERGE_CONFLICT_SOURCE, context, phase=phase.id, outputs=outputs, line=self.guidance.line(worktree.session_agent_id))
