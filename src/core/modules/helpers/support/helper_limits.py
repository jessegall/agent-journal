from core.base.actor_type import ActorType
from core.base.agent_role import AgentRole
from core.base.command.context import Context
from core.base.caller.caller import Caller
from core.base.provider.providers import Providers
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.query.query import Query
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.agents.support.agent_type_limits import NO_LIMIT, AgentTypeLimits, TypeLimits
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.modules.helpers.support.allowed_models import AllowedModels
from core.modules.helpers.support.kept_helpers import KeptHelpers
from core.modules.agents.support.launcher_link import LauncherLink
from core.modules.settings.bindings.support.setting_values import SettingValues

RUNNING_NAMES_CHARACTERS = 60
TERMINAL_LIMIT_TEXT = "stop now: each report wakes you, then start again"
NEXT_HOOK_LIMIT_TEXT = "keep working and read journal overview: each report arrives at your next hook"


class HelperLimits:
    """Who may start a helper, on which model, and how many of a profile run or are kept. A helper with an open job
    holds a run place while its resume is on its way, before its session binds."""

    def __init__(self, queries: Queries, settings: SettingValues, suites: SuiteChoice, models: AllowedModels, providers: Providers, agents: AgentRows, launcher: LauncherLink, limits: AgentTypeLimits, kept: KeptHelpers) -> None:
        self.limits, self.kept = limits, kept
        self.launcher = launcher
        self.queries, self.settings, self.suites, self.models, self.providers, self.agents = queries, settings, suites, models, providers, agents

    def checked_parent(self, context: Context | Caller) -> Agent:
        if context.actor.type is ActorType.AGENT:
            return self.checked_agent(self.agents.find(context.actor.id))
        if context.environment_id is None:
            raise Refusal("a helper starts in one environment", "name it with --environment")
        main = MainAgentFinder.newest(self.queries)
        if main is None:
            raise Refusal("a helper starts under a running main agent", "start one with journal launch")
        return main

    def checked_agent(self, agent: Agent) -> Agent:
        if agent.role not in self.suites.agent_policy().dispatch_roles:
            raise Refusal("a helper starts no helper", "say in your report what should be done next")
        return agent

    def checked_launcher(self) -> None:
        if not self.launcher.is_running:
            raise Refusal("a helper needs the launcher, which is not running", "keep your work and start the journal with journal launch")

    def checked_running(self, profile: str) -> None:
        running_ids = {helper.id for helper in self.helpers(profile).matching(IsNull("ended_at")).all_rows()} | (self.kept.with_open_jobs(profile) - {None})
        limit = self.limits.of(AgentRole.HELPER, profile).run
        if len(running_ids) >= limit:
            names = ", ".join(f"agent:{helper_id}" for helper_id in sorted(running_ids))[:RUNNING_NAMES_CHARACTERS]
            raise Refusal(f"{limit} of {profile} run: {names}", self.next_step_text())

    def checked_new_place(self, profile: str) -> None:
        self.checked_running(profile)
        self.checked_kept(profile)

    def checked_kept(self, profile: str) -> None:
        limit = self.limits.of(AgentRole.HELPER, profile).kept
        if limit != NO_LIMIT and self.helpers(profile).matching(IsNull("retired_at")).count() >= limit:
            raise Refusal(f"{limit} of {profile} exist, which is the limit", TypeLimits.next_step_at_limit(self.kept.kept(profile)))

    def helpers(self, profile: str) -> Query[Agent]:
        return self.queries.query(Agent).filter(role=AgentRole.HELPER, profile=profile)

    def checked_model(self, program: str, model: str) -> str:
        if not model:
            raise Refusal(f"this profile has no model for {program}", "add --model <model>")
        names = self.models.allowed(self.providers.provider(program))
        if model not in names:
            raise Refusal(f"choose a model {program} may run: {', '.join(names)}", "add --model <model>")
        return model

    def next_step_text(self) -> str:
        return TERMINAL_LIMIT_TEXT if self.launcher.is_running else NEXT_HOOK_LIMIT_TEXT
