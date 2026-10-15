from journal.events.models.created import Created
from journal.features.listener import Listener
from journal.models.entry import Entry
from journal.repositories.agents import Agents
from journal.repositories.entries import Entries
from journal.supervisor_link import SupervisorLink

EVERY = 50
"""Journal lines between reminders that a line is an instruction, not a message."""


class RemindNowAndThen(Listener[Created]):
    """Every fiftieth line the journal says to an agent is followed by the reminder of what a journal line is."""

    def __init__(self, entries: Entries, agents: Agents, supervisor: SupervisorLink) -> None:
        self.entries, self.agents, self.supervisor = entries, agents, supervisor

    def handle(self, event: Created) -> None:
        from journal.features.etiquette.feature import Etiquette
        entry = event.model
        if not isinstance(entry, Entry) or entry.kind != "nudge" or entry.data.get("key") == Etiquette.REMIND.key:
            return
        session = entry.data.get("session", "")
        said = len([e for e in self.entries.of_kind(entry.environment_id, "nudge", 1000) if e.data.get("session") == session])
        if said % EVERY == 0:
            self.supervisor.type(entry.environment_id, Etiquette.REMIND.about().rendered())
