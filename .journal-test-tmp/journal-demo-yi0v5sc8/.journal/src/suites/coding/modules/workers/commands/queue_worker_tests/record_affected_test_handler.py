import shlex
from dataclasses import replace

from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.driver.command_category import CommandCategory
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.drivers.support.nudger import Nudger
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.queue_worker_tests.record_affected_test import RecordAffectedTest
from suites.coding.modules.workers.commands.queue_worker_tests.record_worker_test_handler import RecordWorkerTestHandler
from suites.coding.modules.workers.models.affected_test import AffectedTest, AffectedTestState
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worker_job import MERGE_CONFLICT_SOURCE
from suites.coding.modules.workers.support.worker_nudges import WORKER_TESTS_FAILED


class RecordAffectedTestHandler(Handler[RecordAffectedTest, None]):
    """Records picker and selected test results and resumes the worker queue."""

    command = RecordAffectedTest

    def __init__(self, queries: Queries, repository: Repository, bus: Bus, output: OutputFolder, results: RecordWorkerTestHandler, nudger: Nudger) -> None:
        self.queries, self.repository, self.bus, self.output, self.results, self.nudger = queries, repository, bus, output, results, nudger

    def handle(self, command: RecordAffectedTest, context: Context) -> None:
        selected = self.queries.query(AffectedTest).find(command.test_id)
        worktree = self.queries.query(Worktree).find(selected.worktree_id)
        if not command.passed:
            self.fail(selected, worktree, command.process_id, context)
            return
        if selected.state is AffectedTestState.PICKING:
            arguments = [line.strip() for line in self.output.all_output(command.process_id).splitlines() if line.strip()]
            if arguments:
                line = f"{selected.test_command} {shlex.join(arguments)}"
                start = StartProcess.single_part(worktree.agent_id, line, worktree.folder, CommandCategory.TEST_RUN, 3600)
                process = self.bus.dispatch(replace(start, owner_agent_id=worktree.agent_id, task_id=selected.task_id), context)
                self.repository.save(selected.changed(state=AffectedTestState.TESTING, process_id=process.id), context)
                return
        self.repository.save(selected.changed(state=AffectedTestState.PASSED), context)
        self.results.finish(worktree, context)

    def fail(self, selected: AffectedTest, worktree: Worktree, process_id: int, context: Context) -> None:
        self.repository.save(selected.changed(state=AffectedTestState.FAILED), context)
        task = self.queries.query(Task).find(selected.task_id)
        if task.state is TaskState.TESTING:
            self.repository.save(task.moved(TaskLifecycle.retest), context)
        if worktree.state is WorktreeState.DELIVERED:
            self.repository.save(worktree.moved(WorktreeLifecycle.rework), context)
        self.nudger.send(worktree.agent_id, WORKER_TESTS_FAILED, MERGE_CONFLICT_SOURCE, context, outputs=str(process_id))
