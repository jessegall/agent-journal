from engine.cli.row_numbers import RowNumbers
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.event_rows import EventRows
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from engine.driver.nudger import Nudger
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.queue_worker_tests.record_worker_test import RecordWorkerTest
from suites.coding.modules.workers.models.enums.proof_state import TEST_WAITING_STATES, ProofState
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.checkpoint_results import CheckpointResults
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.support.worker_job import MERGE_CONFLICT_SOURCE
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED
from suites.coding.modules.workers.support.worker_test_failures import WorkerTestFailures
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_nudges import PROOF_CHECK, WORKER_COMMIT_PASSED, WORKER_TESTS_FAILED, WORKER_TESTS_PASSED
from core.modules.plans.support.task_plans import TaskPlans
from suites.coding.modules.workers.models.affected_test import AffectedTest, AffectedTestState
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance

LINE_SOURCE = "workers"
TESTS_PASSED_REASON = "its tests passed"
PROOFS_CHECKED_REASON = "its proofs are checked"


class RecordWorkerTestHandler(Handler[RecordWorkerTest, None]):
    """Records test results and settles the tasks of a worktree once none of its tests waits. A task whose
    proofs are all checked is completed; a task with a failed test goes back to its worker, with the outputs,
    and the other tasks are left as they are. The main agent is asked to check the proofs with no test, and
    hears once when every task of a delivered worktree passed. A proof of a merged worktree or of a task of
    a started plan was run by a checkpoint: its result goes to that run."""

    command = RecordWorkerTest
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, repository: Repository, main_agent_line: MergerInbox, nudger: Nudger, rows: EventRows, plans: TaskPlans, failures: WorkerTestFailures, settings: SettingValues,
                 guidance: WorkerGuidance, numbers: RowNumbers, checkpoint_results: CheckpointResults) -> None:
        self.numbers, self.checkpoint_results, self.guidance = numbers, checkpoint_results, guidance
        self.failures, self.settings = failures, settings
        self.queries, self.repository, self.main_agent_line, self.nudger = queries, repository, main_agent_line, nudger
        self.rows, self.plans = rows, plans

    def handle(self, command: RecordWorkerTest, context: Context) -> None:
        proof = self.rows.required(Proof, command.proof_id)
        self.repository.save_change(proof, proof.moved(ProofLifecycle.check) if command.passed else proof.moved(ProofLifecycle.short, shortfall=command.output_note), context)
        worktree = self.rows.required(Worktree, proof.worktree_id)
        if worktree.merged_at is not None or self.plans.is_started_plan(proof.task_id):
            self.checkpoint_results.record(proof.task_id, context)
            return
        self.finish(worktree, context)

    def finish(self, worktree: Worktree, context: Context) -> None:
        waiting = self.finish_tasks(worktree, context)
        for task_id in sorted({row.task_id for row in waiting}):
            proof_ids = ', '.join(str(row.id) for row in waiting if row.task_id == task_id)
            self.main_agent_line.send_nudge(PROOF_CHECK.nudge(worker=self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id), task=task_id, proofs=proof_ids), LINE_SOURCE, context)

    def finish_checked(self, worktree: Worktree, context: Context) -> None:
        self.finish_tasks(worktree, context)

    def finish_tasks(self, worktree: Worktree, context: Context) -> list[Proof]:
        proofs = tuple(self.queries.query(Proof).filter(worktree_id=worktree.id).all_rows())
        if any(row.state in TEST_WAITING_STATES for row in proofs):
            return []
        tasks = self.rows.required_by_id(Task, sorted({row.task_id for row in proofs}))
        failed = [row for row in proofs if row.state is ProofState.SHORT and tasks[row.task_id].state is TaskState.TESTING]
        current = self.reopen_work(worktree, failed, context) if failed else worktree
        pending = self.queries.query(AffectedTest).filter(worktree_id=worktree.id).all_rows()
        if any(row.state in (AffectedTestState.QUEUED, AffectedTestState.PICKING, AffectedTestState.TESTING) for row in pending):
            return []
        completed = self.complete_tested(tasks, proofs, context)
        waiting = [row for row in proofs if row.state is ProofState.SHOWN and tasks[row.task_id].state is TaskState.TESTING]
        if current.state is WorktreeState.CUT:
            if completed and not failed:
                self.nudger.send(current.session_agent_id, WORKER_COMMIT_PASSED, LINE_SOURCE, context, line=self.guidance.line(current.session_agent_id))
            return waiting
        if not waiting:
            self.pass_worktree(current, context)
        return waiting

    def pass_worktree(self, worktree: Worktree, context: Context) -> None:
        self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.mark_tests_passed, tests_passed_at=context.timestamp, merge_ready_at=context.timestamp), context)
        if self.settings.flag(MERGER_ENABLED):
            return
        self.main_agent_line.send_nudge(WORKER_TESTS_PASSED.nudge(worker=self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id)), LINE_SOURCE, context)

    def complete_tested(self, tasks: dict[int, Task], proofs: tuple[Proof, ...], context: Context) -> list[Task]:
        self.plans.prepare(sorted(tasks))
        completed = [task for task in tasks.values() if self.has_passed(task, [row for row in proofs if row.task_id == task.id])]
        for task in completed:
            reason = TESTS_PASSED_REASON if any(row.test_command for row in proofs if row.task_id == task.id) else PROOFS_CHECKED_REASON
            self.repository.save_change(task, task.close(context.timestamp, context.actor, reason), context)
        return completed

    def has_passed(self, task: Task, proofs: list[Proof]) -> bool:
        if self.plans.is_started_plan(task.id):
            return False
        return task.state is TaskState.TESTING and all(row.state is ProofState.CHECKED for row in proofs)

    def reopen_work(self, worktree: Worktree, failed: list[Proof], context: Context) -> Worktree:
        for task_id in sorted({row.task_id for row in failed}):
            self.failures.record_delivery(worktree.session_agent_id, task_id, ", ".join(sorted({row.test_command for row in failed if row.task_id == task_id})), context)
        return self.reopen_tasks(worktree, sorted({row.task_id for row in failed}), ", ".join(str(row.process_id) for row in failed), context)

    def reopen_tasks(self, worktree: Worktree, task_ids: list[int], outputs: str, context: Context) -> Worktree:
        for task in self.rows.required_by_id(Task, task_ids).values():
            if task.state is TaskState.TESTING:
                self.repository.save_change(task, task.moved(TaskLifecycle.retest), context)
        current = self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.rework), context) if worktree.state is WorktreeState.DELIVERED else worktree
        if current.task_id != task_ids[0]:
            current = self.repository.save_change(current, current.moved(WorktreeLifecycle.advance, task_id=task_ids[0]), context)
        self.nudger.send(current.session_agent_id, WORKER_TESTS_FAILED, MERGE_CONFLICT_SOURCE, context, outputs=outputs, line=self.guidance.line(current.session_agent_id))
        return current
