from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.support.actor import Actor
from journal.models.edit import Edit
from journal.support.scope import Scope
from journal.repositories.scoped_repository import ScopedRepository

KEEP = 500


class Edits(ScopedRepository[Edit]):
    model = Edit

    def __init__(self, connection: Connection, bus: Bus, scope: Scope) -> None:
        super().__init__(connection, bus, scope)

    def record(self, edit: Edit, actor: Actor) -> Edit:
        kept = self.save(edit, actor)
        for old in self.selected("1 ORDER BY id DESC LIMIT -1 OFFSET ?", (KEEP,)):
            self.delete(old, actor)
        return kept

    def of_tool_use(self, session: str, tool_use: int) -> list[Edit]:
        return self.selected("session = ? AND tool_use = ? ORDER BY id", (session, tool_use))

    def of_agent(self, session: str, since: float, last: int) -> list[Edit]:
        return list(reversed(self.selected("session = ? AND at > ? ORDER BY id DESC LIMIT ?", (session, since, last))))
