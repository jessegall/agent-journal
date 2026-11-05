from core.base.actor_type import ActorType
from core.base.agent_role import AgentRole
from core.base.command.context import Context
from core.base.provider.providers import Providers
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.modules.helpers.support.allowed_models import AllowedModels
from core.modules.helpers.support.helper_settings import HELPER_LIMIT
from core.modules.agents.support.launcher_link import LauncherLink
from core.modules.settings.bindings.support.setting_values import SettingValues

TERMINAL_LIMIT_TEXT = "stop now: each report wakes you, then start again"
NEXT_HOOK_LIMIT_TEXT = "keep working and read journal overview: each report arrives at your next hook"


class HelperLimits:
    """Who may start a helper, on which model, and how many run in an environment at one time."""

    def __init__(self, queries: Queries, settings: SettingValues, suites: SuiteChoice, models: AllowedModels, providers: Providers, agents: AgentRows, launcher: LauncherLink) -> None:
        self.launcher = launcher
        self.queries, self.settings, self.suites, self.models, self.providers, self.agents = queries, settings, suites, models, providers, agents

    def checked_parent(self, context: Context) -> Agent:
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

    def checked_slot(self, environment_id: int) -> None:
        running = tuple(self.queries.query(Agent).filter(role=AgentRole.HELPER).matching(IsNull("ended_at")).all_rows())
        limit = self.settings.number(HELPER_LIMIT)
        if len(running) >= limit:
            names = ", ".join(f"agent:{helper.id}" for helper in running)
            raise Refusal(f"{limit} helpers run here: {names}", self.next_step_text())

    def checked_model(self, program: str, model: str) -> str:
        if not model:
            raise Refusal(f"this profile has no model for {program}", "add --model <model>")
        names = self.models.allowed(self.providers.provider(program))
        if model not in names:
            raise Refusal(f"choose a model {program} may run: {', '.join(names)}", "add --model <model>")
        return model

    def next_step_text(self) -> str:
        return TERMINAL_LIMIT_TEXT if self.launcher.is_running else NEXT_HOOK_LIMIT_TEXT
