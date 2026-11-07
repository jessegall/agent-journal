from argparse import Namespace

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.main_agent_finder import MainAgentFinder


class AgentMainSubcommand(ReadSubcommand[Agent | None]):
    """`journal agent main [--environment <name>]`: the main agent running in the environment, if one is."""

    cli_name = "agent"
    name = "main"
    environment_refusal = "the main agent is shown for one environment"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def read(self, arguments: Namespace, caller: Caller) -> Agent | None:
        running = MainAgentFinder.rows(self.queries)
        return running[0] if running else None

    def write_output(self, value: object, output: Output) -> None:
        running_id = value.id if isinstance(value, Agent) else None
        output.write(f"agent {running_id}" if running_id is not None else "no main agent is running", {"id": running_id})
