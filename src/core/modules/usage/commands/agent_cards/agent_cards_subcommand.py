from argparse import ArgumentParser, Namespace

from core.base.agent_role import AgentRole
from core.base.caller.caller import Caller
from core.base.environment_names import EnvironmentNames
from core.base.page import Page, is_page
from core.base.query.conditions.among import Among
from core.base.query.conditions.contains_every import ContainsEvery
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.usage.conditions.agent_activity import AgentActivity
from core.modules.usage.conditions.ended_agents import EndedAgents
from core.modules.usage.models.agent_listing import AgentListing
from core.modules.usage.models.enums.agent_list_state import AgentListState


class AgentCardsSubcommand(ReadSubcommand[Page[AgentListing]]):
    """Reads the agents list in creation order, with its filters applied in SQLite."""

    cli_name = "agent"
    name = "cards"

    def __init__(self, queries: Queries, environments: EnvironmentNames, activity: AgentActivity) -> None:
        self.queries, self.environments, self.activity = queries, environments, activity

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")
        parser.add_argument("--show", type=AgentListState, choices=list(AgentListState), default=AgentListState.RUNNING)
        parser.add_argument("--helpers", action="store_true")
        parser.add_argument("--search", default="")
        parser.add_argument("--page", type=int, default=1)
        parser.add_argument("--limit", type=int, default=25)

    def read(self, arguments: Namespace, caller: Caller) -> Page[AgentListing]:
        environment_id = self.environments.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        if environment_id is None:
            raise Refusal("the agents are shown for one environment", "name it with --environment")
        rows = self.queries.query(AgentListing).filter(environment_id=environment_id)
        match arguments.show:
            case AgentListState.RUNNING:
                rows = rows.matching(self.activity)
            case AgentListState.CLOSED:
                rows = rows.matching(EndedAgents(self.activity))
        if arguments.helpers:
            rows = rows.matching(Among("role", tuple(role for role in AgentRole if role is not AgentRole.MAIN)))
        if arguments.search.strip():
            rows = rows.matching(ContainsEvery(("session", "program", "role", "program_model", "profile", "given_name", "dispatch_profile", "dispatch_description"), arguments.search.split()))
        return rows.ordered("created_at", "id").page(arguments.page, arguments.limit)

    def write_output(self, value: object, output: Output) -> None:
        if is_page(value):
            output.page(value)
