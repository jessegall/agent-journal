from argparse import REMAINDER, ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.processes.models.process import Process
from suites.coding.modules.workers.commands.run_worker_test.run_worker_test import RunWorkerTest


class RunWorkerTestSubcommand(Subcommand[RunWorkerTest, Process]):
    """`journal worker test <name> <test files>`: runs one of the worker's named test commands."""

    cli_name = "worker"
    name = "test"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("name")
        parser.add_argument("test_arguments", nargs=REMAINDER)

    def command(self, arguments: Namespace, caller: Caller) -> RunWorkerTest:
        return RunWorkerTest(arguments.name, tuple(arguments.test_arguments))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Process):
            output.line(f"test run queued: output {value.id}; stop or go on working, you hear when it ends")
