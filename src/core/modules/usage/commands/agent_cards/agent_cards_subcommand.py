from core.base.query.conditions.is_null import IsNull
from pathlib import Path
from argparse import ArgumentParser, Namespace
import json

from core.base.profile.agent_profile import AgentProfile
from core.modules.profiles.support.profile_files import ProfileFiles
from core.base.agent_role import AgentRole
from core.base.helper_kind import HelperKind
from core.base.caller.caller import Caller
from core.base.provider.providers import Providers
from core.base.registry.registry import Registry
from core.modules.agents.models.agent import Agent, UPGRADE_RETIREMENT_REASON
from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.usage.commands.usage_agents.usage_agents_subcommand import UsageAgentsSubcommand
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
from core.modules.usage.conditions.agent_role_profile_condition import AgentRoleProfileCondition
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

    def __init__(self, queries: Queries, activity: AgentActivity, profiles: ProfileFiles, providers: Providers, folders: AgentFolders, usage: UsageAgentsSubcommand, registry: Registry) -> None:
        self.queries, self.activity, self.profiles = queries, activity, profiles
        self.providers, self.folders = providers, folders
        self.usage = usage
        self.registry = registry

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--options", action="store_true")
        parser.add_argument("--id", type=int, default=None)
        parser.add_argument("--include-main", action="store_true")
        parser.add_argument("--kept", action="store_true")
        parser.add_argument("--role", action="append", default=[])
        parser.add_argument("--profile", action="append", default=[])
        parser.add_argument("--program", action="append", default=[])
        parser.add_argument("--roles", default="")
        parser.add_argument("--profiles", default="")
        parser.add_argument("--programs", default="")
        parser.add_argument("--show", type=AgentListState, choices=list(AgentListState), default=AgentListState.RUNNING)
        parser.add_argument("--search", default="")
        parser.add_argument("--page", type=int, default=1)
        parser.add_argument("--limit", type=int, default=25)

    def read(self, arguments: Namespace, caller: Caller) -> Page[AgentListingState] | AgentFilterOptions:
        arguments.role += [value for value in arguments.roles.split(",") if value]
        arguments.profile += [value for value in arguments.profiles.split(",") if value]
        arguments.program += [value for value in arguments.programs.split(",") if value]
        titles = {profile.name: profile.display_title for profile in self.profiles.listed() if isinstance(profile, AgentProfile)}
        if arguments.options:
            options = self.queries.query(AgentFilterOptionsView).first()
            if options is None:
                return AgentFilterOptions((), ())
            upgrade_retired = self.queries.query(Agent).matching(EndedAgents()).filter(retirement_reason=UPGRADE_RETIREMENT_REASON).count()
            return AgentFilterOptions(tuple(sorted(role for role in json.loads(options.roles) if role != AgentRole.MAIN)), tuple((name, titles.get(name, name)) for name in sorted(profile for profile in json.loads(options.profiles) if profile)), upgrade_retired)
        activity = self.activity.current()
        rows = self.queries.query(AgentListing)
        if arguments.kept:
            rows = rows.matching(IsNull("retired_at"))
        if arguments.id is not None:
            rows = rows.filter(id=arguments.id)
        if not arguments.include_main and (not arguments.role or AgentRole.MAIN not in arguments.role):
            rows = rows.matching(Equal("role", AgentRole.MAIN, negated=True))
        if arguments.role or arguments.profile:
            rows = rows.matching(AgentRoleProfileCondition(arguments.role, arguments.profile))
        if arguments.program:
            rows = rows.matching(Among("program", arguments.program))
        match arguments.show:
            case AgentListState.RUNNING:
                rows = rows.matching(activity)
            case AgentListState.IDLE:
                rows = rows.matching(AvailableAgents(activity))
            case AgentListState.RETIRED:
                rows = rows.matching(EndedAgents())
            case _:
                pass
        if arguments.search.strip():
            rows = rows.matching(ContainsEvery(("session", "program", "role", "program_model", "profile", "given_name", "job_profile", "job_description"), arguments.search.split()))
        page = rows.ordered("created_at", "id").page(arguments.page, arguments.limit)
        selected = self.queries.query(AgentListing).matching(Among("id", tuple(row.id for row in page.rows)))
        running = {row.id for row in selected.matching(activity).all_rows()}
        idle = {row.id for row in selected.matching(AvailableAgents(activity)).all_rows()}
        states = {**dict.fromkeys(running, AgentListState.RUNNING), **dict.fromkeys(idle, AgentListState.IDLE)}
        agents = {agent.id: agent for agent in self.queries.query(Agent).find_many(tuple(row.id for row in page.rows))}
        locations = self.folders.resume_locations(tuple(agents[row.id] for row in page.rows if row.id in idle))
        policy = self.usage.suites.agent_policy()
        pending = activity.pending
        job_commands = {entry.key: entry.job_command for entry in self.registry.helper_types}
        task_flags = {entry.key: entry.job_task_flag for entry in self.registry.helper_types}
        statuses = self.usage.statuses(page.rows)
        account = self.usage.files.plan_windows(statuses)
        sandboxes = self.usage.sandbox.sandboxed_among(tuple(agents.values()))
        return Page(tuple(AgentListingState(**vars(row), state=states.get(row.id, AgentListState.RETIRED),
                                           resume_reason=self.resume_reason(agents[row.id], *locations[row.id]) if row.id in idle else None,
                                           facts=self.usage.facts(row, policy, titles, pending.get(row.id), statuses[row.session], account, sandboxes[row.id]).json(),
                                           job_command=job_commands.get(row.role, ()),
                                           job_task_flag=task_flags.get(row.role, "")) for row in page.rows),
                    page.number, page.size, page.total)

    def resume_reason(self, agent: Agent, has_folder: bool, folder: Path) -> str | None:
        if agent.role == HelperKind.READ_ONLY and not agent.profile:
            return "This helper ran as a program subagent and cannot resume."
        if not has_folder:
            return "The folder this agent worked in is gone."
        if not self.providers.provider(agent.program).session_matches_folder(folder, agent.session):
            return "The saved session is gone; this agent cannot resume."
        return None

    def write_output(self, value: object, output: Output) -> None:
        if is_page(value):
            output.page(value)
        if isinstance(value, AgentFilterOptions):
            output.write("agent filter options", {"roles": value.roles, "profiles": [{"name": name, "title": title} for name, title in value.profiles],
                                                  "states": [{"key": state.value, "label": state.label} for state in AgentListState],
                                                  "upgrade_retired": value.upgrade_retired})
