from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from core.base.provider.providers import Providers
from engine.query.queries import Queries
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_control_list import AgentControlList


class AgentControlsSubcommand(ReadSubcommand[AgentControlList]):
    """`journal agent controls <agent>`: what the agent bar can change on this agent's program, with its
    choices."""

    cli_name = "agent"
    name = "controls"

    def __init__(self, queries: Queries, providers: Providers) -> None:
        self.queries, self.providers = queries, providers

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> AgentControlList:
        return AgentControlList(self.providers.provider(self.queries.query(Agent).find(arguments.agent_id).program).controls)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, AgentControlList):
            output.write(", ".join(group.key for group in value.groups) or "no controls", value.json())
