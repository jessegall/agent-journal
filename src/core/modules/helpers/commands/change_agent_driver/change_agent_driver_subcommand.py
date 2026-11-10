from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.agent_number import AgentNumber
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_label import AgentLabel
from core.modules.helpers.commands.change_agent_driver.change_agent_driver import ChangeAgentDriver


class ChangeAgentDriverSubcommand(Subcommand[ChangeAgentDriver, Agent]):
    """`journal agent driver <agent> --program <program> --model <model>`: moves a stopped agent to another
    program or model. It stays the same agent, with a new session."""

    cli_name = "agent"
    name = "driver"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_id", type=AgentNumber)
        parser.add_argument("--program", required=True)
        parser.add_argument("--model", required=True)

    def command(self, arguments: Namespace, caller: Caller) -> ChangeAgentDriver:
        return ChangeAgentDriver(arguments.agent_id, arguments.program, arguments.model)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Agent):
            output.line(f"{AgentLabel.from_agent(value).text} runs on {value.program} {value.program_model} from its next session")
