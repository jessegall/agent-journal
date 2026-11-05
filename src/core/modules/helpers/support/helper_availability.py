import shutil

from core.base.agent_role import AgentRole
from core.base.provider.providers import Providers
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.launcher_link import LauncherLink
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.helpers.support.helper_settings import HELPER_LIMIT
from core.modules.helpers.support.helper_start_state import HelperStartState
from core.modules.settings.bindings.support.setting_values import SettingValues

NO_LAUNCHER = "Start the agent with journal launch to run helpers."
NO_MAIN_AGENT = "Start a main agent first: a helper reports to it."
AT_LIMIT = "All {limit} helpers are running: wait for one to finish, or stop one."


class HelperAvailability:
    """Says whether a helper can start from the window, in words a person reads, and on which programs."""

    def __init__(self, launcher: LauncherLink, queries: Queries, settings: SettingValues, providers: Providers) -> None:
        self.launcher, self.queries, self.settings, self.providers = launcher, queries, settings, providers

    def state(self) -> HelperStartState:
        return HelperStartState(self.refusal_reason(), tuple(provider.name for provider in self.providers.all() if shutil.which(provider.executable)))

    def refusal_reason(self) -> str:
        if not self.launcher.is_running:
            return NO_LAUNCHER
        if MainAgentFinder.newest(self.queries) is None:
            return NO_MAIN_AGENT
        limit = self.settings.number(HELPER_LIMIT)
        running = self.queries.query(Agent).filter(role=AgentRole.HELPER).matching(IsNull("ended_at")).count()
        return AT_LIMIT.format(limit=limit) if running >= limit else ""
