from core.base.command.context import Context
from core.base.repository.repository import Repository
from core.modules.drivers.support.main_agent_line import MainAgentLine
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED


class MergerInbox:
    """Where a line about a worker goes: to the merger while it is on, which passes on what the main agent must act
    on, and otherwise to the main agent."""

    def __init__(self, repository: Repository, main_line: MainAgentLine, settings: SettingValues) -> None:
        self.repository, self.main_line, self.settings = repository, main_line, settings

    def send(self, text: str, source: str, context: Context) -> None:
        if self.settings.flag(MERGER_ENABLED):
            self.repository.save(MergerLine(environment_id=context.environment_id, text=text, fallback_source=source), context)
            return
        self.main_line.send(text, source, context)
