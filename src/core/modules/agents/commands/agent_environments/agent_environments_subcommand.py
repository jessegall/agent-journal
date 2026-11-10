from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.query.queries import Queries
from core.base.scope.environment_scope import EnvironmentScope
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.support.active_environments import ActiveEnvironments
from core.modules.agents.support.main_agent_finder import MainAgentFinder


class AgentEnvironmentsSubcommand(ReadSubcommand[ActiveEnvironments]):
    """`journal agent environments`: the environments a main agent is running in."""

    cli_name = "agent"
    name = "environments"
    disabled_scopes = [EnvironmentScope]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        pass

    def read(self, arguments: Namespace, caller: Caller) -> ActiveEnvironments:
        return ActiveEnvironments(sorted({agent.environment_id for agent in MainAgentFinder.all_running(self.queries)}))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, ActiveEnvironments):
            output.write(value.line(), value.json())
