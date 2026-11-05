from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.query import Query
from core.modules.library.models.library_connection import LibraryConnection


class LibraryConnectionQuery(Query[LibraryConnection]):
    """Reads this journal's connection to a shared server, of which there is at most one."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, LibraryConnection)

    def current(self) -> LibraryConnection | None:
        return self.oldest().first()
