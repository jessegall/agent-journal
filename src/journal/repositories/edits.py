from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.support.actor import Actor
from journal.models.edit import Edit
from journal.repositories.scope import Scope
from journal.repositories.scoped_repository import ScopedRepository

EDIT_ROWS = 500


class Edits(ScopedRepository[Edit]):
    model = Edit

    def __init__(self, connection: Connection, bus: Bus, scope: Scope) -> None:
        super().__init__(connection, bus, scope)

    def record(self, edit: Edit, actor: Actor) -> Edit:
        stored = self.save(edit, actor)
        for old in self.selected(self.query().order_descending("id").offset(EDIT_ROWS)):
            self.delete(old, actor)
        return stored

    def tool_use_edits(self, session: str, tool_use: int) -> list[Edit]:
        return self.selected(self.query().filter(session=session, tool_use=tool_use).order("id"))

    def agent_edits(self, session: str, start: float, last: int) -> list[Edit]:
        return list(reversed(self.selected(self.query().filter(session=session).filter_greater("time", start).order_descending("id").limit(last))))
