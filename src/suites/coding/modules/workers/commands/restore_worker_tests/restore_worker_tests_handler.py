from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.driver.command_category import CommandCategory
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.tasks.commands.make_task_log.make_task_log import MakeTaskLog
from suites.coding.modules.workers.commands.restore_worker_tests.restore_worker_tests import RestoreWorkerTests
from suites.coding.modules.workers.models.enums.worker_test_request_state import WorkerTestRequestState
from suites.coding.modules.workers.models.lifecycles.worker_test_request_lifecycle import WorkerTestRequestLifecycle
from suites.coding.modules.workers.models.worker_test_request import WorkerTestRequest
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_phases import WorkerPhases
from suites.coding.modules.workers.support.worker_test_flag import WorkerTestFlag


class RestoreWorkerTestsHandler(Handler[RestoreWorkerTests, tuple[WorkerTestRequest, ...]]):
    """Allows again the requests a stopped run used, when the run never started and its worker is still held
    to a phase's tests, and logs it on the task."""

    command = RestoreWorkerTests
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, repository: Repository, bus: Bus, phases: WorkerPhases, worktrees: WorktreeQuery) -> None:
        self.queries, self.repository, self.bus, self.phases, self.worktrees = queries, repository, bus, phases, worktrees

    def handle(self, command: RestoreWorkerTests, context: Context) -> tuple[WorkerTestRequest, ...]:
        process = self.queries.query(Process).find(command.process_id)
        if process.queued_at is None or self.phases.waiting_group(process.session_agent_id) is None:
            return ()
        task_id = self.worktrees.worker_worktree(process.session_agent_id).task_id
        parts = self.queries.query(ProcessPart).filter(process_id=process.id, category=CommandCategory.TEST_RUN).all_rows()
        used = {request.command: request for request in self.queries.query(WorkerTestRequest).filter(worker_id=process.session_agent_id, task_id=task_id, state=WorkerTestRequestState.USED).oldest().all_rows()}
        restored = []
        for text in dict.fromkeys(WorkerTestFlag.run_part_flag(part).command for part in parts):
            request = used.get(text)
            if request is not None:
                restored.append(self.repository.save_change(request, request.moved(WorkerTestRequestLifecycle.restore), context))
                self.bus.dispatch(MakeTaskLog(task_id, f"request {request.id} was not used: its run stopped before it started"), context)
        return tuple(restored)
