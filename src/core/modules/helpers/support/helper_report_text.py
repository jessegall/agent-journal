from engine.driver.hook_event import HookEvent
from engine.provider.providers import Providers
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.agents.support.report_agent_messages import REPORT_FIELD


class HelperReportText:
    """What a helper hands in as it stops: the text its stop hook carries, else the last reply its program
    wrote."""

    def __init__(self, providers: Providers, folders: AgentFolders) -> None:
        self.providers, self.folders = providers, folders

    def text(self, event: HookEvent, helper: Agent) -> str:
        stop_text = f"{event.raw.get(REPORT_FIELD, '')}".strip()
        return stop_text or self.providers.provider(event.program).last_reply(self.folders.folder(helper), helper.session)
