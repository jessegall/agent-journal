from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.drivers.commands.refresh_agent_pin.refresh_agent_pin import RefreshAgentPin
from core.modules.drivers.models.agent_stack import AgentStack


class RefreshAgentPinSubcommand(Subcommand[RefreshAgentPin, AgentStack]):
    """`journal driver repin <agent>`: a person pins an agent to the live parts of the new driver now."""

    cli_name = "driver"
    name = "repin"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> RefreshAgentPin:
        return RefreshAgentPin(arguments.agent)
