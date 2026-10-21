from datetime import datetime, timezone

from journal.features.memory.support.memory_row import MemoryRow
from journal.features.memory.support.memory_data import MemoryData
from journal.models.agent import Agent
from journal.repositories.facts import Facts
from journal.repositories.reminders import Reminders
from journal.repositories.rules import Rules
from journal.repositories.setting_rows import SettingRows
from journal.support.chat_mark import ChatMark


class MemoryDataReader:
    """Reads the memory feature's part of the feature data for an agent."""

    def __init__(self, facts: Facts, rules: Rules, reminders: Reminders, settings: SettingRows) -> None:
        self.facts, self.rules, self.reminders, self.settings = facts, rules, reminders, settings

    def read(self, agent: Agent) -> MemoryData:
        rows = [*(MemoryRow("fact", f.id, f.text, tuple(f.keywords), ChatMark.FACTS, f.presence) for f in self.facts.in_()), *(MemoryRow("rule", r.id, r.text, tuple(r.keywords), ChatMark.RULES, r.presence) for r in self.rules.all()), *(MemoryRow("reminder", r.id, r.text, tuple(r.keywords), ChatMark.REMINDERS, r.presence) for r in self.reminders.in_())]
        from journal.features.memory.feature import Memory
        return MemoryData(mark_owed=agent.mark_owed, context_mark=agent.context_mark, rows=tuple(rows), stale=self.stale(int(self.settings.option(Memory.STALENESS_LIMIT))))

    def stale(self, days: int) -> tuple[str, ...]:
        moment = datetime.now(timezone.utc)
        aged = [("fact", row) for row in self.facts.in_()] + [("rule", row) for row in self.rules.all()] + [("reminder", row) for row in self.reminders.in_()]
        ages = [(kind, row.id, (moment - (row.updated_at or row.created_at)).days) for kind, row in aged if row.updated_at or row.created_at]
        return tuple(f"{kind} {row_id}, {age} days" for kind, row_id, age in ages if age >= days)
