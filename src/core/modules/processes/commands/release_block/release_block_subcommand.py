from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.agent_ids import AgentIds
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.processes.commands.release_block.release_block import ReleaseBlock


class ReleaseBlockSubcommand(Subcommand[ReleaseBlock, int]):
    """`journal process lift-hold <agent>`: what the agent card's Lift this hold button sends; only a user may."""

    cli_name = "process"
    name = "lift-hold"

    def __init__(self, agent_ids: AgentIds) -> None:
        self.agent_ids = agent_ids

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent", type=int, help="the number of the agent")

    def command(self, arguments: Namespace, caller: Caller) -> ReleaseBlock:
        return ReleaseBlock(self.agent_ids.checked(arguments.agent, caller.environment_id))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, int):
            output.line(f"{value} holds lifted")
