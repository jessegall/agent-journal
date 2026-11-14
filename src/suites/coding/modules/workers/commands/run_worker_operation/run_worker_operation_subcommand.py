from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.command.bus import Bus
from engine.errors.refusal import Refusal
from engine.subcommand.subcommand import Subcommand
from engine.time.polled_wait import PolledWait
from suites.coding.modules.workers.commands.run_worker_operation.claim_worker_operation import ClaimWorkerOperation
from suites.coding.modules.workers.commands.run_worker_operation.run_worker_operation import RunWorkerOperation
from suites.coding.modules.workers.models.enums.worker_operation_name import WorkerOperationName
from suites.coding.modules.workers.models.worker_operation import WorkerOperation
from suites.coding.modules.workers.queries.worker_operation_query import WorkerOperationQuery

TURN_WAIT = PolledWait(limit_seconds=3600, pause_seconds=1)


class RunWorkerOperationSubcommand(Subcommand[RunWorkerOperation, str]):
    """Runs an accepted worker command in its queued process; an update first waits for the worker's earlier
    commands to end, so it never moves files under a commit or a merge."""

    cli_name = "worker-operation"
    name = "run"
    outward = True

    def __init__(self, bus: Bus, operations: WorkerOperationQuery) -> None:
        self.bus, self.operations = bus, operations

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("worker_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> RunWorkerOperation:
        if caller.process_id is None:
            raise Refusal("only the queued process runs this worker command")
        operation = self.bus.run(ClaimWorkerOperation(arguments.worker_id, caller.process_id), caller.actor, environment_id=caller.environment_id)
        if operation.name is WorkerOperationName.UPDATE:
            self.waited_turn(operation)
        return RunWorkerOperation(operation)

    def waited_turn(self, operation: WorkerOperation) -> None:
        if not TURN_WAIT.poll(lambda: not self.operations.runs_prior(operation.worker_id, operation.process_id)):
            raise Refusal(f"the update waited {int(TURN_WAIT.limit_seconds)} seconds for the worker's earlier command to end", "run journal worker update again once it ended")
