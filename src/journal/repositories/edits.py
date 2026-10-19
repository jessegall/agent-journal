from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.models.actor import Actor
from journal.models.edit import Edit
from journal.repositories.scope import Scope
from journal.repositories.scoped_repository import ScopedRepository

KEEP = 500
"""How many edits an environment keeps: the older ones go as new ones come."""


class Edits(ScopedRepository[Edit]):
    model = Edit

    def __init__(self, connection: Connection, bus: Bus, scope: Scope) -> None:
        super().__init__(connection, bus, scope)

    def record(self, edit: Edit, by: Actor) -> Edit:
        """An edit kept, and the oldest beyond the last five hundred let go."""
        kept = self.save(edit, by)
        for old in self.selected("1 ORDER BY id DESC LIMIT -1 OFFSET ?", (KEEP,)):
            self.delete(old, by)
        return kept

    def of_agent(self, session: str, since: float) -> list[Edit]:
        """An agent's edits after the moment given, oldest first."""
        return self.selected("session = ? AND at > ? ORDER BY id", (session, since))
