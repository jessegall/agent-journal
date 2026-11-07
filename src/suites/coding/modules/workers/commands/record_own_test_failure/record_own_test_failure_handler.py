from core.base.command.context import Context
from core.base.command.handler import Handler
from suites.coding.modules.workers.commands.record_own_test_failure.record_own_test_failure import RecordOwnTestFailure
from suites.coding.modules.workers.support.worker_test_failures import WorkerTestFailures


class RecordOwnTestFailureHandler(Handler[RecordOwnTestFailure, None]):
    """Counts a failed test a worker ran itself, which the worker is not told about."""

    command = RecordOwnTestFailure

    def __init__(self, failures: WorkerTestFailures) -> None:
        self.failures = failures

    def handle(self, command: RecordOwnTestFailure, context: Context) -> None:
        self.failures.record_worker_run(command.worker_id, command.task_id, command.line, context)
