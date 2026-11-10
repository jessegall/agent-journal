from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.processes.commands.support.output_lines import OutputLines
from core.modules.processes.models.enums.process_state import RUNNING_STATES, ProcessState
from core.modules.processes.models.process import Process
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.output_access import OutputAccess


OUTPUTS_SHOWN = 100


class ShowOutputStatusSubcommand(ReadSubcommand[OutputLines]):
    """`journal output status [n]`: one line for each of the last 100 outputs, oldest first, running, finished,
    or failed with its code."""

    cli_name = "output"
    name = "status"
    environment_refusal = "outputs are read in an environment"

    def __init__(self, access: OutputAccess, processes: ProcessQuery) -> None:
        self.access, self.processes = access, processes

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("process_id", type=int, nargs="?")

    def read(self, arguments: Namespace, caller: Caller) -> OutputLines:
        if arguments.process_id is not None:
            return OutputLines([self.line(self.access.process(caller.actor, arguments.process_id))])
        query = self.processes.newest()
        if self.access.has_private_outputs(caller.actor):
            query = query.agent(caller.actor.id)
        return OutputLines([self.line(process) for process in reversed(query.limited(OUTPUTS_SHOWN))])

    def line(self, process: Process) -> str:
        if process.state in RUNNING_STATES:
            return f"{process.id}  running"
        if process.state is ProcessState.FAILED:
            return f"{process.id}  failed with code {process.exit_code}"
        return f"{process.id}  {process.state.value}"

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, OutputLines):
            value.write(output, "nothing found")
