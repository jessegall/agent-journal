from argparse import REMAINDER, ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.base.driver.shell_line import JOURNAL_PROGRAM
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.run_visibility import RunVisibility
from suites.coding.modules.workers.commands.run_worker_test.run_worker_test import RunWorkerTest
from suites.coding.modules.workers.support.worker_test_run import WorkerTestRun
from suites.coding.modules.workers.support.worker_run_answer import WorkerRunAnswer
from suites.coding.modules.workers.support.worker_test_wait import WorkerTestWait

PIPED_LINES = 1_000_000
SHORT_LINES = 20


class RunWorkerTestSubcommand(Subcommand[RunWorkerTest, WorkerTestRun]):
    """`journal worker test <name> <test files>`: runs one of the worker's named test commands and answers with
    its summary when it ends within the worker's wait, the whole output for a pipe, and always its output number."""

    cli_name = "worker"
    name = "test"
    allows_pipes = True

    def __init__(self, wait: WorkerTestWait, folder: OutputFolder, run_answer: WorkerRunAnswer, outputs: OutputQuery, visibility: RunVisibility) -> None:
        self.wait, self.folder, self.run_answer, self.outputs, self.visibility = wait, folder, run_answer, outputs, visibility

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("name")
        parser.add_argument("test_arguments", nargs=REMAINDER)

    def command(self, arguments: Namespace, caller: Caller) -> RunWorkerTest:
        return RunWorkerTest(arguments.name, tuple(arguments.test_arguments), self.is_piped(caller))

    def write_output(self, value: object, output: Output) -> None:
        return None

    def after_listeners(self, value: object, output: Output) -> None:
        if not isinstance(value, WorkerTestRun):
            return
        process_id = value.process.id
        exit_code = self.wait.exit_code(process_id)
        if exit_code is None:
            output.line(f"test run in the background: output {process_id}; {self.run_answer.test_instruction(value.process.session_agent_id)}")
            return
        for line in self.folder.last_lines(process_id, PIPED_LINES) if value.piped else self.short_lines(process_id):
            output.line(line)
        output.line(f"output {process_id} ended with exit code {exit_code}")
        output.line(f"full output saved as output {process_id}")

    def is_piped(self, caller: Caller) -> bool:
        if caller.process_id is None:
            return False
        return any(part.piped and part.program == JOURNAL_PROGRAM for part in self.visibility.parts(caller.process_id))

    def short_lines(self, process_id: int) -> list[str]:
        kept = self.outputs.process_output(process_id)
        if kept is None or not kept.reader_summary:
            return self.folder.last_lines(process_id, SHORT_LINES)
        return [*self.folder.reader_lines(process_id), f"summary: {kept.reader_summary}"]
