from argparse import Namespace

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.main_agent_finder import MainAgentFinder


class ShowMainAgentsSubcommand(ReadSubcommand[tuple[Agent, ...]]):
    """`journal agent running-main-agents --environment <name>`: every main agent running in the environment."""

    cli_name = "agent"
    name = "running-main-agents"
    environment_refusal = "the running main agents are shown for one environment"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def read(self, arguments: Namespace, caller: Caller) -> tuple[Agent, ...]:
        return MainAgentFinder.all_running(self.queries)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, tuple):
            ids = [agent.id for agent in value if isinstance(agent, Agent)]
            output.write("\n".join(f"agent {agent_id}" for agent_id in ids), {"rows": [{"id": agent_id} for agent_id in ids]})
