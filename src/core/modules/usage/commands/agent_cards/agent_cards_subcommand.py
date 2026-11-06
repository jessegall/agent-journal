from argparse import ArgumentParser, Namespace
import json

from core.base.profile.agent_profile import AgentProfile
from core.modules.profiles.support.profile_files import ProfileFiles
from core.base.agent_role import AgentRole
from core.base.caller.caller import Caller
from core.base.page import Page, is_page
from core.base.query.conditions.among import Among
from core.base.query.conditions.equal import Equal
from core.base.query.conditions.contains_every import ContainsEvery
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.usage.models.agent_filter_options_view import AgentFilterOptionsView
from core.modules.usage.support.agent_filter_options import AgentFilterOptions
from core.modules.usage.conditions.agent_activity import AgentActivity
from core.modules.usage.conditions.agent_kinds import AgentKinds
from core.modules.usage.conditions.ended_agents import EndedAgents
from core.modules.usage.conditions.available_agents import AvailableAgents
from core.modules.usage.models.agent_listing import AgentListing
from core.modules.usage.models.support.agent_listing_state import AgentListingState
from core.modules.usage.models.enums.agent_list_state import AgentListState


class AgentCardsSubcommand(ReadSubcommand[Page[AgentListingState] | AgentFilterOptions]):
    """Reads the agents list in creation order, with its filters applied in SQLite."""

    cli_name = "agent"
    name = "cards"
    environment_refusal = "the agents are shown for one environment"

    def __init__(self, queries: Queries, activity: AgentActivity, profiles: ProfileFiles) -> None:
        self.queries, self.activity, self.profiles = queries, activity, profiles

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--options", action="store_true")
        parser.add_argument("--include-main", action="store_true")
        parser.add_argument("--role", action="append", default=[])
        parser.add_argument("--profile", action="append", default=[])
        parser.add_argument("--program", action="append", default=[])
        parser.add_argument("--show", type=AgentListState, choices=list(AgentListState), default=AgentListState.RUNNING)
        parser.add_argument("--search", default="")
        parser.add_argument("--page", type=int, default=1)
        parser.add_argument("--limit", type=int, default=25)

    def read(self, arguments: Namespace, caller: Caller) -> Page[AgentListingState] | AgentFilterOptions:
        if arguments.options:
            options = self.queries.query(AgentFilterOptionsView).first()
            if options is None:
                return AgentFilterOptions((), ())
            titles = {profile.name: profile.display_title for profile in self.profiles.listed() if isinstance(profile, AgentProfile)}
            return AgentFilterOptions(tuple(sorted(role for role in json.loads(options.roles) if role != AgentRole.MAIN)), tuple((name, titles.get(name, name)) for name in sorted(profile for profile in json.loads(options.profiles) if profile)))
        rows = self.queries.query(AgentListing)
        if not arguments.include_main and (not arguments.role or AgentRole.MAIN not in arguments.role):
            rows = rows.matching(Equal("role", AgentRole.MAIN, negated=True))
        if arguments.role or arguments.profile:
            rows = rows.matching(AgentKinds(arguments.role, arguments.profile))
        if arguments.program:
            rows = rows.matching(Among("program", arguments.program))
        match arguments.show:
            case AgentListState.RUNNING:
                rows = rows.matching(self.activity)
            case AgentListState.IDLE:
                rows = rows.matching(AvailableAgents(self.activity))
            case AgentListState.RETIRED:
                rows = rows.matching(EndedAgents(self.activity))
            case _:
                pass
        if arguments.search.strip():
            rows = rows.matching(ContainsEvery(("session", "program", "role", "program_model", "profile", "given_name", "job_profile", "job_description"), arguments.search.split()))
        page = rows.ordered("created_at", "id").page(arguments.page, arguments.limit)
        selected = self.queries.query(AgentListing).matching(Among("id", tuple(row.id for row in page.rows)))
        running = {row.id for row in selected.matching(self.activity).all_rows()}
        idle = {row.id for row in selected.matching(AvailableAgents(self.activity)).all_rows()}
        states = {**dict.fromkeys(running, AgentListState.RUNNING), **dict.fromkeys(idle, AgentListState.IDLE)}
        return Page(tuple(AgentListingState(**vars(row), state=states.get(row.id, AgentListState.RETIRED)) for row in page.rows),
                    page.number, page.size, page.total)

    def write_output(self, value: object, output: Output) -> None:
        if is_page(value):
            output.page(value)
        if isinstance(value, AgentFilterOptions):
            output.write("agent filter options", {"roles": value.roles, "profiles": [{"name": name, "title": title} for name, title in value.profiles]})
