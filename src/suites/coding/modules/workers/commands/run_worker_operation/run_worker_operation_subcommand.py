from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.command.bus import Bus
from engine.errors.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.run_worker_operation.claim_worker_operation import ClaimWorkerOperation
from suites.coding.modules.workers.commands.run_worker_operation.run_worker_operation import RunWorkerOperation


class RunWorkerOperationSubcommand(Subcommand[RunWorkerOperation, str]):
    cli_name = "worker-operation"
    name = "run"
    outward = True

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("worker_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> RunWorkerOperation:
        if caller.process_id is None:
            raise Refusal("only the queued process runs this worker command")
        operation = self.bus.run(ClaimWorkerOperation(arguments.worker_id, caller.process_id), caller.actor,
                                 environment_id=caller.environment_id)
        return RunWorkerOperation(operation)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, str):
            output.line(value)
