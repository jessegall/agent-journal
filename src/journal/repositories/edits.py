from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.support.actor import Actor
from journal.models.edit import Edit
from journal.support.scope import Scope
from journal.repositories.scoped_repository import ScopedRepository

EDIT_LIMIT = 500


class Edits(ScopedRepository[Edit]):
    model = Edit

    def __init__(self, connection: Connection, bus: Bus, scope: Scope) -> None:
        super().__init__(connection, bus, scope)

    def record(self, edit: Edit, actor: Actor) -> Edit:
        stored = self.save(edit, actor)
        for old in self.selected("1 ORDER BY id DESC LIMIT -1 OFFSET ?", (EDIT_LIMIT,)):
            self.delete(old, actor)
        return stored

    def tool_use_edits(self, session: str, tool_use: int) -> list[Edit]:
        return self.selected("session = ? AND tool_use = ? ORDER BY id", (session, tool_use))

    def agent_edits(self, session: str, start: float, last: int) -> list[Edit]:
        return list(reversed(self.selected("session = ? AND time > ? ORDER BY id DESC LIMIT ?", (session, start, last))))
