from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.agents.commands.type_terminal_line.type_terminal_line import TypeTerminalLine
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_label import AgentLabel


class TypeTerminalLineSubcommand(Subcommand[TypeTerminalLine, Agent]):
    """`journal agent type <agent> <line>`: types a line and its Enter into a running agent's terminal."""

    cli_name = "agent"
    name = "type"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_id", type=int)
        parser.add_argument("line")

    def command(self, arguments: Namespace, caller: Caller) -> TypeTerminalLine:
        return TypeTerminalLine(arguments.agent_id, arguments.line)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Agent):
            output.line(f"typed in the terminal of {AgentLabel.labelled(value).text}")
