from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.record_worker_test_run.record_worker_test_run import RecordWorkerTestRun
from suites.coding.modules.workers.models.worker_test_run import WorkerTestRun


class RecordWorkerTestRunHandler(Handler[RecordWorkerTestRun, WorkerTestRun]):
    """Saves a counted test run after no rule refused the command."""

    command = RecordWorkerTestRun
    disabled_scopes = [ActorScope]

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: RecordWorkerTestRun, context: Context) -> WorkerTestRun:
        return self.repository.save(WorkerTestRun(worker_id=command.worker_id, group_key=command.group_key), context)
