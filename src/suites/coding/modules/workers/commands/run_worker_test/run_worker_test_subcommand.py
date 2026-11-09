from argparse import REMAINDER, ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import OutputFolder
from suites.coding.modules.workers.commands.run_worker_test.run_worker_test import RunWorkerTest
from suites.coding.modules.workers.support.worker_run_answer import WorkerRunAnswer
from suites.coding.modules.workers.support.worker_test_wait import WorkerTestWait

SHOWN_LINES = 200


class RunWorkerTestSubcommand(Subcommand[RunWorkerTest, Process]):
    """`journal worker test <name> <test files>`: runs one of the worker's named test commands and answers with
    its output when it ends within the worker's wait, and with its output number when it does not."""

    cli_name = "worker"
    name = "test"

    def __init__(self, wait: WorkerTestWait, folder: OutputFolder, run_answer: WorkerRunAnswer) -> None:
        self.wait, self.folder, self.run_answer = wait, folder, run_answer

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("name")
        parser.add_argument("test_arguments", nargs=REMAINDER)

    def command(self, arguments: Namespace, caller: Caller) -> RunWorkerTest:
        return RunWorkerTest(arguments.name, tuple(arguments.test_arguments))

    def write_output(self, value: object, output: Output) -> None:
        return None

    def after_listeners(self, value: object, output: Output) -> None:
        if not isinstance(value, Process):
            return
        exit_code = self.wait.exit_code(value.id)
        if exit_code is None:
            output.line(f"test run in the background: output {value.id}; {self.run_answer.test_instruction(value.session_agent_id)}")
            return
        for line in self.folder.last_lines(value.id, SHOWN_LINES):
            output.line(line)
        output.line(f"output {value.id} ended with exit code {exit_code}")
