from argparse import REMAINDER, ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.agent_number import AgentNumber
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.agents.commands.start_agent_program.start_agent_program import StartAgentProgram
from core.modules.agents.models.enums.dispatch import Dispatch


class StartAgentProgramSubcommand(Subcommand[StartAgentProgram, Dispatch]):
    """`journal agent start-program <agent> --folder <folder> <program line>`: starts the agent's program through
    the dispatcher and prints what the start came to."""

    cli_name = "agent"
    name = "start-program"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_id", type=AgentNumber)
        parser.add_argument("--folder", required=True)
        parser.add_argument("program_line", nargs=REMAINDER)

    def command(self, arguments: Namespace, caller: Caller) -> StartAgentProgram:
        return StartAgentProgram(arguments.agent_id, tuple(arguments.program_line), arguments.folder)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Dispatch):
            output.line(f"start: {value.value}")
