from argparse import Namespace

from engine.caller.caller import Caller
from engine.query.queries import Queries
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.types.type_guards import is_tuple
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.agents.support.agent_label import AgentLabel


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
        if is_tuple(value):
            agents = [agent for agent in value if isinstance(agent, Agent)]
            output.write("\n".join(f"{AgentLabel.from_agent(agent).text}, session {agent.session}" for agent in agents), {"rows": [{"id": agent.id} for agent in agents]})
