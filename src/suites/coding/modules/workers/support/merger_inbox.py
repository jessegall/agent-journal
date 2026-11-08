from core.base.command.context import Context
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.helper_job_rows import HelperJobRows
from core.base.driver.nudge import Nudge
from core.base.repository.repository import Repository
from core.modules.drivers.support.main_agent_line import MainAgentLine
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.support.merger_nudges import MERGER_LINE_AVAILABLE, MERGER_PROFILE
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED


class MergerInbox:
    """Where a line about a worker goes: to the merger while it is on, which passes on what the main agent must act
    on, and otherwise to the main agent."""

    def __init__(self, repository: Repository, main_line: MainAgentLine, settings: SettingValues, queries: Queries, jobs: HelperJobRows) -> None:
        self.repository, self.main_line, self.settings, self.queries, self.jobs = repository, main_line, settings, queries, jobs

    def merger_runs(self) -> bool:
        merger = self.queries.query(Agent).filter(profile=MERGER_PROFILE).matching(IsNull("retired_at")).newest().first()
        return merger is not None and (merger.ended_at is None or self.jobs.open_job(merger.id) is not None)

    def send(self, text: str, source: str, context: Context) -> None:
        enabled = self.settings.flag(MERGER_ENABLED)
        line = self.repository.save(MergerLine(text=text, fallback_source=source, read_at=None if enabled else context.timestamp), context)
        if not enabled:
            self.main_line.send_nudge(MERGER_LINE_AVAILABLE.nudge(line=line.id), source, context)

    def send_nudge(self, nudge: Nudge, source: str, context: Context) -> None:
        if self.settings.flag(MERGER_ENABLED):
            self.repository.save(MergerLine(text=nudge.text, fallback_source=source, nudge_json=nudge.stored.json), context)
            return
        self.main_line.send_nudge(nudge, source, context)
