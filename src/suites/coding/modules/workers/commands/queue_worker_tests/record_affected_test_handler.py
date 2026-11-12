import shlex
from dataclasses import replace

from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.enums.command_category import CommandCategory
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.queue_worker_tests.record_affected_test import RecordAffectedTest
from suites.coding.modules.workers.commands.queue_worker_tests.record_worker_test_handler import RecordWorkerTestHandler
from suites.coding.modules.workers.models.affected_test import AffectedTest
from suites.coding.modules.workers.models.enums.affected_test_state import AffectedTestState
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worktree import Worktree


class RecordAffectedTestHandler(Handler[RecordAffectedTest, None]):
    """Records picker and selected test results and resumes the worker queue. A failed run sends every task
    of the worktree that is in testing back to its worker, with the output."""

    command = RecordAffectedTest

    def __init__(self, queries: Queries, repository: Repository, bus: Bus, output: OutputFolder, results: RecordWorkerTestHandler) -> None:
        self.queries, self.repository, self.bus, self.output, self.results = queries, repository, bus, output, results

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
        tested_ids = {proof.task_id for proof in self.queries.query(Proof).filter(worktree_id=worktree.id).all_rows()}
        testing = self.queries.query(Task).matching(Among("id", sorted(tested_ids | {first_answer.task_id}))).filter(state=TaskState.TESTING).ordered("id").all_rows()
        self.results.reopen_tasks(worktree, [task.id for task in testing] or [first_answer.task_id], str(process_id), context)
