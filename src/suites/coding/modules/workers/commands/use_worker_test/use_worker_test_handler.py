from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from core.modules.tasks.commands.make_task_log.make_task_log import MakeTaskLog
from suites.coding.modules.workers.commands.use_worker_test.use_worker_test import UseWorkerTest
from suites.coding.modules.workers.models.lifecycles.worker_test_request_lifecycle import WorkerTestRequestLifecycle
from suites.coding.modules.workers.models.worker_test_request import WorkerTestRequest


class UseWorkerTestHandler(Handler[UseWorkerTest, WorkerTestRequest]):
    """Marks an allowed request as used and logs the run on the task."""

    command = UseWorkerTest
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, repository: Repository, bus: Bus) -> None:
        self.queries, self.repository, self.bus = queries, repository, bus

    def handle(self, command: UseWorkerTest, context: Context) -> WorkerTestRequest:
        request = self.queries.query(WorkerTestRequest).find(command.request_id)
        used = self.repository.save_change(request, request.moved(WorkerTestRequestLifecycle.use), context)
        self.bus.dispatch(MakeTaskLog(request.task_id, f"worker {request.worker_id} ran request {request.id}"), context)
        return used
