from journal.features.memory.support.memory_row import MemoryRow
from journal.features.memory.support.memory_standing import MemoryStanding
from journal.models.agent import Agent
from journal.repositories.entries import Entries
from journal.repositories.facts import Facts
from journal.repositories.reminders import Reminders
from journal.repositories.rules import Rules
from journal.support.chat_mark import ChatMark


class MemoryStandingReader:
    """Reads the memory feature's part of the Standing for an agent."""

    def __init__(self, facts: Facts, rules: Rules, reminders: Reminders, entries: Entries) -> None:
        self.facts, self.rules, self.reminders, self.entries = facts, rules, reminders, entries

    def read(self, agent: Agent) -> MemoryStanding:
        rows = [*(MemoryRow("fact", f.id, f.text, tuple(f.keywords), ChatMark.FACTS) for f in self.facts.in_()), *(MemoryRow("rule", r.id, r.text, tuple(r.keywords), ChatMark.RULES) for r in self.rules.all()), *(MemoryRow("reminder", r.id, r.text, tuple(r.keywords), ChatMark.REMINDERS) for r in self.reminders.in_())]
        from journal.features.memory.feature import Memory
        since = self.entries.last_id_of_kind(agent.session, "Compacting")
        lines_in_window = tuple(self.entries.lines_said_after(agent.session, Memory.MEMORY_WHISPERED_BACK.key, since))
        return MemoryStanding(mark_owed=agent.mark_owed, context_mark=agent.context_mark, rows=tuple(rows), lines_in_window=lines_in_window)
