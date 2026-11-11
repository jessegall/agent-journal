from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.agent_number import AgentNumber
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.agents.commands.stop_agent_program.stop_agent_program import StopAgentProgram
from core.modules.agents.models.enums.stop_reason import StopReason
from core.modules.agents.models.enums.stopped import Stopped


class StopAgentProgramSubcommand(Subcommand[StopAgentProgram, Stopped]):
    """`journal agent stop-program <agent>`: stops the agent's program through the dispatcher; its row ends once
    the program is gone."""

    cli_name = "agent"
    name = "stop-program"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_id", type=AgentNumber)

    def command(self, arguments: Namespace, caller: Caller) -> StopAgentProgram:
        return StopAgentProgram(arguments.agent_id, StopReason.AGENT if caller.actor.is_agent() else StopReason.PERSON)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Stopped):
            output.line(f"stop: {value.value}")
