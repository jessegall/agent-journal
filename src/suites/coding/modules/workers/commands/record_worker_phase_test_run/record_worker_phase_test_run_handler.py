from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.record_worker_phase_test_run.record_worker_phase_test_run import RecordWorkerPhaseTestRun
from suites.coding.modules.workers.models.worker_phase_test_run import WorkerPhaseTestRun


class RecordWorkerPhaseTestRunHandler(Handler[RecordWorkerPhaseTestRun, WorkerPhaseTestRun]):
    """Saves a counted test run after no rule refused the command."""

    command = RecordWorkerPhaseTestRun
    disabled_scopes = [ActorScope]

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: RecordWorkerPhaseTestRun, context: Context) -> WorkerPhaseTestRun:
        return self.repository.save(WorkerPhaseTestRun(worker_id=command.worker_id, phase_id=command.phase_id), context)
