from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.models.model import Model
from journal.repositories.repository import Repository


class TableRows(Repository):
    """The plain repository of any one model, which a change pulled from the team server is written through."""

    def __init__(self, connection: Connection, bus: Bus, model: type[Model]) -> None:
        self.model = model
        super().__init__(connection, bus)

    def clear(self) -> None:
        self._purged(self.query())
