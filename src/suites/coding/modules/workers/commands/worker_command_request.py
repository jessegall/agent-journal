from argparse import ArgumentParser, Namespace
import shlex

from engine.caller.caller import Caller
from engine.cli.write_flags import WriteFlags
from engine.command.command import Command
from engine.subcommand.output import Output
from suites.coding.modules.workers.commands.queue_worker_operation.queue_worker_operation import QueueWorkerOperation, WorkerCommand
from suites.coding.modules.workers.models.worker_operation import WorkerOperation
from suites.coding.modules.workers.models.enums.worker_operation_name import WorkerOperationName
from suites.coding.modules.workers.queries.worker_operation_query import WorkerOperationQuery
from core.modules.agents.support.agent_label import AgentLabel
from engine.cli.row_numbers import RowNumbers


class WorkerCommandRequest:
    """Queues public worker commands and preserves explicit waits for scripts."""

    def __init__(self, operations: WorkerOperationQuery, flags: WriteFlags, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.operations, self.flags = operations, flags

    @staticmethod
    def arguments(parser: ArgumentParser) -> None:
        parser.add_argument("--wait", action="store_true", help="wait for this command to finish")

    def command(self, command: WorkerCommand, worker_id: int, argv: list[str], arguments: Namespace, caller: Caller) -> Command[object]:
        if arguments.wait:
            self.operations.check_available(worker_id, caller.process_id)
            return command
        flags = [argument for name in sorted(self.flags.skipped_guards(arguments)) for argument in ("--skip-guard", name)]
        if arguments.skip_reason:
            flags.extend(("--skip-reason", arguments.skip_reason))
        return QueueWorkerOperation(worker_id, shlex.join([*argv, "--wait", *flags]), command,
                                    WorkerOperationName(argv[1]), caller.plugin_script)

    def write_output(self, value: object, output: Output) -> bool:
        if not isinstance(value, WorkerOperation):
            return False
        output.line(f"{AgentLabel.from_row_id(value.worker_id, self.numbers, "worker").text} command accepted: output {value.process_id}; stop or go on working, you hear when it ends")
        return True
