from argparse import Namespace

from engine.caller.caller import Caller
from engine.query.queries import Queries
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.agents.support.agent_label import AgentLabel


class AgentMainSubcommand(ReadSubcommand[Agent | None]):
    """`journal agent main [--environment <name>]`: the main agent running in the environment, if one is, by its
    number, the one every agent argument takes; its row id only as a labelled field."""

    cli_name = "agent"
    name = "main"
    environment_refusal = "the main agent is shown for one environment"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def read(self, arguments: Namespace, caller: Caller) -> Agent | None:
        running = MainAgentFinder.rows(self.queries)
        return running[0] if running else None

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Agent):
            output.write(f"{AgentLabel.from_agent(value).text}, agent:{value.number}, session {value.session}, row id {value.id}", {"id": value.id, "number": value.number})
            return
        output.write("no main agent is running", {"id": None, "number": None})
