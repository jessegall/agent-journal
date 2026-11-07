from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.agents.commands.choose_agent_control.choose_agent_control import ChooseAgentControl
from core.modules.agents.models.agent import Agent


class ChooseAgentControlSubcommand(Subcommand[ChooseAgentControl, Agent]):
    """`journal agent control <agent> <key> <value>`: applies one choice of the agent bar, such as model opus.
    """

    cli_name = "agent"
    name = "control"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_id", type=int)
        parser.add_argument("key")
        parser.add_argument("value")

    def command(self, arguments: Namespace, caller: Caller) -> ChooseAgentControl:
        return ChooseAgentControl(arguments.agent_id, arguments.key, arguments.value)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Agent):
            output.line(f"applied to agent {value.id}")
