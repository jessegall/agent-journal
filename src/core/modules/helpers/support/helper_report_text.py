from engine.driver.hook_event import HookEvent
from engine.provider.providers import Providers
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.agents.support.report_agent_messages import REPORT_FIELD
from core.modules.helpers.models.helper_steer import HelperSteer


class HelperReportText:
    """What a helper hands in as it stops: the text its stop hook carries, else the last reply its program
    wrote, followed by each steer its parent added to the job and the helper's answer to it."""

    def __init__(self, providers: Providers, folders: AgentFolders, queries: Queries) -> None:
        self.providers, self.folders, self.queries = providers, folders, queries

    def text(self, event: HookEvent, helper: Agent, job_id: int) -> str:
        stop_text = f"{event.raw.get(REPORT_FIELD, '')}".strip()
        report = stop_text or self.providers.provider(event.program).last_reply(self.folders.folder(helper), helper.session)
        steers = self.queries.query(HelperSteer).filter(job_id=job_id).oldest().get()
        return "\n\n".join(part for part in (report, *(steer.report_part() for steer in steers)) if part)
