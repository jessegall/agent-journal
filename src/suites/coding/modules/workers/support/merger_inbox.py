from dataclasses import replace

from engine.command.context import Context
from engine.driver.nudge import Nudge
from engine.repository.repository import Repository
from core.modules.drivers.support.main_agent_line import MainAgentLine
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.models.enums.ask_outcome import AskOutcome
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.support.merger_nudges import MERGER_LINE_AVAILABLE
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED


class MergerInbox:
    """Where a line about a worker goes: to the merger while it is on, which passes on what the main agent
    must act on, and otherwise to the main agent; a worker's question that goes to the main agent this way is
    recorded as forwarded."""

    def __init__(self, repository: Repository, main_line: MainAgentLine, settings: SettingValues) -> None:
        self.repository, self.main_line, self.settings = repository, main_line, settings

    def send(self, text: str, source: str, context: Context) -> None:
        self.deliver(MergerLine(text=text, fallback_source=source), context)

    def deliver(self, line: MergerLine, context: Context) -> None:
        enabled = self.settings.flag(MERGER_ENABLED)
        saved = self.repository.save(line if enabled else self.forwarded(line, context), context)
        if not enabled:
            self.main_line.send_nudge(MERGER_LINE_AVAILABLE.nudge(line=saved.id), line.fallback_source, context)

    @staticmethod
    def forwarded(line: MergerLine, context: Context) -> MergerLine:
        if line.worker_id is None:
            return replace(line, read_at=context.timestamp)
        return replace(line, read_at=context.timestamp, outcome=AskOutcome.FORWARDED, closed_at=context.timestamp)

    def send_nudge(self, nudge: Nudge, source: str, context: Context) -> None:
        if self.settings.flag(MERGER_ENABLED):
            self.repository.save(MergerLine(text=nudge.text, fallback_source=source, nudge_json=nudge.stored.json), context)
            return
        self.main_line.send_nudge(nudge, source, context)
