import shutil

from core.base.agent_role import AgentRole
from core.base.provider.providers import Providers
from core.base.query.queries import Queries
from core.modules.agents.support.launcher_link import LauncherLink
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.helpers.support.helper_settings import HELPER_RUN_LIMIT
from core.modules.helpers.support.helper_start_state import HelperStartState
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.agents.support.agent_rows import AgentRows

MISSING_LAUNCHER_TEXT = "Start the agent with journal launch to run helpers."
MISSING_MAIN_AGENT_TEXT = "Start a main agent first: a helper reports to it."
LIMIT_REACHED_TEXT = "All {limit} helpers are running: wait for one to finish, or stop one."


class HelperAvailability:
    """Says whether a helper can start from the window, in words a person reads, and on which programs."""

    def __init__(self, launcher: LauncherLink, queries: Queries, agents: AgentRows, settings: SettingValues, providers: Providers) -> None:
        self.launcher, self.queries, self.agents, self.settings, self.providers = launcher, queries, agents, settings, providers

    def state(self) -> HelperStartState:
        return HelperStartState(self.refusal_reason(), tuple(provider.name for provider in self.providers.all() if shutil.which(provider.executable)))

    def refusal_reason(self) -> str:
        if not self.launcher.is_running:
            return MISSING_LAUNCHER_TEXT
        if MainAgentFinder.newest(self.queries) is None:
            return MISSING_MAIN_AGENT_TEXT
        limit = self.settings.number(HELPER_RUN_LIMIT)
        running = len(self.agents.running(AgentRole.HELPER))
        return LIMIT_REACHED_TEXT.format(limit=limit) if running >= limit else ""
