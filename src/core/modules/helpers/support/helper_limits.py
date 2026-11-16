from engine.query.conditions.among import Among
from engine.helper_type.helper_type_book import HELPER_KEY, HelperTypeBook
from engine.enums.actor_type import ActorType
from engine.command.context import Context
from engine.caller.caller import Caller
from engine.provider.providers import Providers
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.query.query import Query
from engine.errors.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.usage.support.agent_type_limits import AgentTypeLimits
from core.modules.agents.support.type_limits import TypeLimits
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.helpers.support.agent_start_check import AgentStartCheck
from core.modules.helpers.support.allowed_models import AllowedModels
from core.modules.helpers.support.kept_helpers import KeptHelpers
from core.modules.helpers.support.profile_model import ProfileModel
from core.modules.agents.support.agent_statuses import AgentStatuses
from engine.setting.setting_values import SettingValues

RUNNING_NAMES_CHARACTERS = 60
TERMINAL_LIMIT_TEXT = "stop now: each report wakes you, then start again"
NEXT_HOOK_LIMIT_TEXT = "keep working and read journal overview: each report arrives at your next hook"


class HelperLimits:
    """Who may start a helper, on which model, and how many of a profile run or are kept. A helper with an open job
    holds a run place while its resume is on its way, before its session binds."""

    def __init__(self, queries: Queries, settings: SettingValues, models: AllowedModels, providers: Providers, agents: AgentRows, statuses: AgentStatuses, limits: AgentTypeLimits, kept: KeptHelpers, start_check: AgentStartCheck, types: HelperTypeBook) -> None:
        self.types = types
        self.start_check = start_check
        self.limits, self.kept = limits, kept
        self.statuses = statuses
        self.queries, self.settings, self.models, self.providers, self.agents = queries, settings, models, providers, agents

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
        if not self.types.behaviours(agent.role).dispatches:
            raise Refusal("a read-only helper starts no helper", "say in your report what should be done next")
        return agent

    def checked_launcher(self) -> None:
        if not self.statuses.is_launcher_running:
            raise Refusal("a helper needs the launcher, which is not running", "keep your work and start the journal with journal launch")

    def checked_running(self, profile: str) -> None:
        running_ids = set(self.helpers(profile).matching(IsNull("ended_at")).pluck("id", int)) | self.kept.with_open_jobs(profile)
        limit = self.helper_limits(profile).run
        if len(running_ids) >= limit:
            names = ", ".join(f"agent:{helper_id}" for helper_id in sorted(running_ids))[:RUNNING_NAMES_CHARACTERS]
            raise Refusal(f"{limit} of {profile} run: {names}", self.next_step_text())

    def checked_new_place(self, profile: str) -> None:
        self.checked_running(profile)

    def helper_limits(self, profile: str) -> TypeLimits:
        limits = self.limits.lookup(HELPER_KEY, profile)
        if limits is None:
            raise Refusal("no limits are declared for helpers", "a module declares the helper type with its limit settings")
        return limits

    def helpers(self, profile: str) -> Query[Agent]:
        return self.queries.query(Agent).filter(profile=profile).matching(Among("role", self.types.read_access_keys()))

    def checked_new_session(self, profile: str) -> None:
        self.start_check.checked_new("helper", profile)

    def checked_resume(self, profile: str) -> None:
        self.start_check.checked_resume("helper", profile)

    def checked_helper_model(self, helper: Agent) -> None:
        self.start_check.checked_model("helper", helper.profile, helper.program, helper.program_model)

    def checked_resume_session(self, helper: Agent) -> None:
        self.checked_resume(helper.profile)
        self.checked_helper_model(helper)

    def checked_model(self, program: str, model: str) -> str:
        return self.listed_model(program, model, self.models.allowed(self.providers.provider(program)))

    def checked_profile_model(self, selection: ProfileModel) -> str:
        self.require_model(selection.program, selection.model)
        self.start_check.checked_provider("helper", selection.profile, selection.program)
        return self.listed_model(selection.program, selection.model, self.models.models_allowed(self.providers.provider(selection.program), "helper", selection.profile))

    def listed_model(self, program: str, model: str, names: list[str]) -> str:
        self.require_model(program, model)
        if model not in names:
            raise Refusal(f"{model} cannot run on {program}; choose a model {program} may run: {', '.join(names)}", "add --model <model>")
        return model

    @staticmethod
    def require_model(program: str, model: str) -> None:
        if not model:
            raise Refusal(f"this profile has no model for {program}", "add --model <model>")

    def next_step_text(self) -> str:
        return TERMINAL_LIMIT_TEXT if self.statuses.is_launcher_running else NEXT_HOOK_LIMIT_TEXT
