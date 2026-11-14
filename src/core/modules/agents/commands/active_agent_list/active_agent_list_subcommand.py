from argparse import Namespace

from engine.caller.caller import Caller
from engine.row.page import Page, is_page
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.models.agent import Agent
from core.modules.agents.queries.agent_query import AgentQuery

ACTIVE_AGENTS_LIMIT_COUNT = 200


class ActiveAgentListSubcommand(ReadSubcommand[Page[Agent]]):
    """`journal agent running [--environment <name>]`: every agent of the environment still running, however long ago
    it started."""

    cli_name = "agent"
    name = "running"
    environment_refusal = "the running agents are shown for one environment"

    def __init__(self, agents: AgentQuery) -> None:
        self.agents = agents

    def read(self, arguments: Namespace, caller: Caller) -> Page[Agent]:
        return self.agents.running().oldest().page(1, ACTIVE_AGENTS_LIMIT_COUNT)

    def write_output(self, value: object, output: Output) -> None:
        if is_page(value):
            output.page(value)
