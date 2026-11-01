from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.processes.commands.support.output_lines import OutputLines
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.output_access import OutputAccess

RUNNING = (ProcessState.RUNNING, ProcessState.BACKGROUND)


class ShowOutputStatusSubcommand(ReadSubcommand[OutputLines]):
    """`journal output status [n]`: one line for each output, running, finished, or failed with its code."""

    cli_name = "output"
    name = "status"

    def __init__(self, access: OutputAccess, processes: ProcessQuery) -> None:
        self.access, self.processes = access, processes

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("process_id", type=int, nargs="?")

    def read(self, arguments: Namespace, caller: Caller) -> OutputLines:
        if arguments.process_id is not None:
            return OutputLines([self.line(self.access.process(caller.actor, arguments.process_id))])
        query = self.processes.environment(self.access.environment(caller.actor, caller.environment_id)).oldest()
        if self.access.is_worker(caller.actor):
            query = query.agent(caller.actor.id)
        return OutputLines([self.line(process) for process in query.all_rows()])

    def line(self, process: Process) -> str:
        if process.state in RUNNING:
            return f"{process.id}  running"
        if process.state is ProcessState.FAILED:
            return f"{process.id}  failed with code {process.exit_code}"
        return f"{process.id}  {process.state.value}"

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, OutputLines):
            value.write(output, "nothing found")
