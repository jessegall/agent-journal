from argparse import ArgumentParser, Namespace

from core.base.agent_role import AgentRole
from core.base.caller.caller import Caller
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.active_environments import ActiveEnvironments


class AgentEnvironmentsSubcommand(ReadSubcommand[ActiveEnvironments]):
    """`journal agent environments`: the environments a main agent is running in."""

    cli_name = "agent"
    name = "environments"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        pass

    def read(self, arguments: Namespace, caller: Caller) -> ActiveEnvironments:
        agents = self.queries.query(Agent).filter(role=AgentRole.MAIN).matching(IsNull("ended_at")).all_rows()
        return ActiveEnvironments(sorted({agent.environment_id for agent in agents}))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, ActiveEnvironments):
            output.write(value.line(), value.json())
