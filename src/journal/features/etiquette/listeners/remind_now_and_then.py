from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.models.created import Created
from journal.features.listener import Listener
from journal.models.entry import Entry
from journal.repositories.entries import Entries
from journal.supervisor_link import SupervisorLink

EVERY = 50
"""Journal lines between reminders that a line is an instruction, not a message."""


class RemindNowAndThen(Listener[Created]):
    """Every fiftieth line the journal says to an agent is followed by the reminder of what a journal line is, said as a nudge of its own, so its window holds however the count falls."""

    def __init__(self, entries: Entries, machine: Machine, nudger: Nudger, supervisor: SupervisorLink) -> None:
        self.entries, self.machine, self.nudger, self.supervisor = entries, machine, nudger, supervisor

    def handle(self, event: Created) -> None:
        from journal.features.etiquette.feature import Etiquette
        entry = event.model
        if not isinstance(entry, Entry) or entry.kind != "nudge" or entry.data.get("key") == Etiquette.REMIND.key:
            return
        session = entry.data.get("session", "")
        if not session or self.entries.said_to(entry.environment_id, session) % EVERY:
            return
        line = self.nudger.say(self.machine.agent(session, entry.environment_id), Etiquette.REMIND.about())
        if line:
            self.supervisor.type(entry.environment_id, line)
