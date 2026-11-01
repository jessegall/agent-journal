from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.agents.commands.type_in_terminal.type_in_terminal import TypeInTerminal
from core.modules.agents.models.agent import Agent


class AgentTypeSubcommand(Subcommand[TypeInTerminal, Agent]):
    """`journal agent type <agent> <line>`: types a line and its Enter into a running agent's terminal."""

    cli_name = "agent"
    name = "type"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_id", type=int)
        parser.add_argument("line")

    def command(self, arguments: Namespace, caller: Caller) -> TypeInTerminal:
        return TypeInTerminal(arguments.agent_id, arguments.line)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Agent):
            output.line(f"typed in the terminal of agent {value.id}")
