from typing import Self

from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.query import Query
from core.modules.processes.models.reader import Reader


class ReaderQuery(Query[Reader]):
    """Reads readers, with the filters the processes module uses by name."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Reader)

    def named(self, name: str) -> Self:
        return self.filter(name=name)

    def defaults(self) -> Self:
        return self.filter(is_default=True)
