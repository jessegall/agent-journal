from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.agent_number import AgentNumber
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.support.agent_dispatcher import AgentDispatcher
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.agents.support.standing import Standing


class AgentStandingSubcommand(ReadSubcommand[Standing]):
    """`journal agent standing <agent>`: whether the agent's program runs, as the dispatcher works it out, and
    for an agent that ended the reason."""

    cli_name = "agent"
    name = "standing"

    def __init__(self, dispatcher: AgentDispatcher, agents: AgentRows) -> None:
        self.dispatcher, self.agents = dispatcher, agents

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_id", type=AgentNumber)

    def read(self, arguments: Namespace, caller: Caller) -> Standing:
        return self.dispatcher.standing(self.agents.find(arguments.agent_id))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Standing):
            output.write(value.text, {"standing": value.stage.value, "reason": value.reason})
