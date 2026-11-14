from engine.database.database import Database
from engine.database.kept_rows import KeptRows
from engine.model.tables import Tables
from engine.query.query import Query
from core.modules.library.models.library_connection import LibraryConnection


class LibraryConnectionQuery(Query[LibraryConnection]):
    """Reads this journal's connection to a shared server, of which there is at most one."""

    def __init__(self, database: Database, tables: Tables, kept: KeptRows) -> None:
        super().__init__(database, tables, LibraryConnection)
        self.kept = kept

    def current(self) -> LibraryConnection | None:
        connections = self.oldest()
        return self.kept.read(connections, connections.first, name="library.current_connection")

    def remember(self, connection: LibraryConnection) -> None:
        self.kept.update(self.oldest(), lambda previous: connection, name="library.current_connection")

    def remove(self) -> None:
        self.kept.update(self.oldest(), lambda previous: None, name="library.current_connection")
