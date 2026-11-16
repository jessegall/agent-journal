from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.agent_id import AgentId
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.support.agent_statuses import AgentStatuses
from core.modules.agents.support.agent_status import AgentStatus


class AgentStatusSubcommand(ReadSubcommand[AgentStatus]):
    """`journal agent status <agent>`: whether the agent's program runs, as the dispatcher works it out, and
    for an agent that ended the reason."""

    cli_name = "agent"
    name = "status"

    def __init__(self, statuses: AgentStatuses) -> None:
        self.statuses = statuses

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_id", type=AgentId)

    def read(self, arguments: Namespace, caller: Caller) -> AgentStatus:
        return self.statuses.status(arguments.agent_id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, AgentStatus):
            output.write(value.text, {"state": value.program_state.value, "reason": value.reason})
