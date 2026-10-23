from datetime import datetime, timezone

from journal.features.memory.support.memory_row import MemoryRow
from journal.features.memory.support.memory_data import MemoryData
from journal.features.memory.support.timed_reminder import TimedReminder
from journal.models.agent import Agent
from journal.repositories.facts import Facts
from journal.repositories.reminders import Reminders
from journal.repositories.rules import Rules
from journal.repositories.setting_rows import SettingRows
from journal.support.card_kind import CardKind


class MemoryDataReader:
    """Reads the memory feature's part of the feature data for an agent."""

    def __init__(self, facts: Facts, rules: Rules, reminders: Reminders, settings: SettingRows) -> None:
        self.facts, self.rules, self.reminders, self.settings = facts, rules, reminders, settings

    def read(self, agent: Agent) -> MemoryData:
        rows = [*(MemoryRow("fact", f.row_id, f.text, tuple(f.keywords), CardKind.FACTS, f.presence) for f in self.facts.scoped()), *(MemoryRow("rule", r.row_id, r.text, tuple(r.keywords), CardKind.RULES, r.presence) for r in self.rules.all()), *(MemoryRow("reminder", r.row_id, r.text, tuple(r.keywords), CardKind.REMINDERS, r.presence) for r in self.reminders.standing())]
        from journal.features.memory.feature import Memory
        return MemoryData(threshold_due=agent.threshold_due, context_threshold=agent.context_threshold, rows=tuple(rows), stale=self.stale(self.settings.integer(Memory.STALENESS_LIMIT)), timed=tuple(TimedReminder(r.row_id, r.text, r.due_at.timestamp()) for r in self.reminders.timed()))

    def stale(self, days: int) -> tuple[str, ...]:
        moment = datetime.now(timezone.utc)
        aged = [("fact", row) for row in self.facts.scoped()] + [("rule", row) for row in self.rules.all()] + [("reminder", row) for row in self.reminders.standing()]
        ages = [(kind, row.row_id, (moment - row.update_time).days) for kind, row in aged]
        return tuple(f"{kind} {row_id}, {age} days" for kind, row_id, age in ages if age >= days)
