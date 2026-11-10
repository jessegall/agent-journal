import shlex
from dataclasses import replace

from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.command_category import CommandCategory
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.support.nudger import Nudger
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.commands.queue_worker_tests.record_affected_test import RecordAffectedTest
from suites.coding.modules.workers.commands.queue_worker_tests.record_worker_test_handler import RecordWorkerTestHandler
from suites.coding.modules.workers.models.affected_test import AffectedTest, AffectedTestState
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worker_job import MERGE_CONFLICT_SOURCE
from suites.coding.modules.workers.support.worker_nudges import WORKER_TESTS_FAILED
from suites.coding.modules.workers.support.worker_phases import WorkerPhases


class RecordAffectedTestHandler(Handler[RecordAffectedTest, None]):
    """Records picker and selected test results and resumes the worker queue."""

    command = RecordAffectedTest

    def __init__(self, queries: Queries, repository: Repository, bus: Bus, output: OutputFolder, results: RecordWorkerTestHandler, nudger: Nudger, phases: WorkerPhases, guidance: WorkerGuidance) -> None:
        self.guidance = guidance
        self.queries, self.repository, self.bus, self.output, self.results, self.nudger, self.phases = queries, repository, bus, output, results, nudger, phases

    def handle(self, command: RecordAffectedTest, context: Context) -> None:
        first_answer = self.queries.query(AffectedTest).find(command.test_id)
        worktree = self.queries.query(Worktree).find(first_answer.worktree_id)
        if not command.passed:
            self.fail(first_answer, worktree, command.process_id, context)
            return
        if first_answer.state is AffectedTestState.PICKING:
            arguments = [line.strip() for line in self.output.all_output(command.process_id).splitlines() if line.strip()]
            if arguments:
                line = f"{first_answer.test_command} {shlex.join(arguments)}"
                start = StartProcess.single_part(worktree.session_agent_id, line, worktree.folder, CommandCategory.TEST_RUN, 3600)
                process = self.bus.dispatch(replace(start, owner_agent_id=worktree.session_agent_id, task_id=first_answer.task_id), context)
                self.repository.save_change(first_answer, first_answer.changed(state=AffectedTestState.TESTING, process_id=process.id), context)
                return
        self.repository.save_change(first_answer, first_answer.changed(state=AffectedTestState.PASSED), context)
        self.results.finish(worktree, context)

    def fail(self, first_answer: AffectedTest, worktree: Worktree, process_id: int, context: Context) -> None:
        self.repository.save_change(first_answer, first_answer.changed(state=AffectedTestState.FAILED), context)
        task = self.queries.query(Task).find(first_answer.task_id)
        if task.state is TaskState.TESTING:
            self.repository.save_change(task, task.moved(TaskLifecycle.retest), context)
        if worktree.state is WorktreeState.DELIVERED:
            self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.rework), context)
        phase = self.phases.phase(task)
        if phase is None:
            self.nudger.send(worktree.session_agent_id, WORKER_TESTS_FAILED, MERGE_CONFLICT_SOURCE, context, outputs=str(process_id), line=self.guidance.line(worktree.session_agent_id))
            return
        self.results.send_phase_failures(worktree, phase, str(process_id), context)
