from typing import Self

from core.base.database.database import Database
from core.base.database.kept_rows import KeptRows
from core.base.model.tables import Tables
from engine.query.query import Query
from core.modules.aliases.models.alias import Alias


class AliasQuery(Query[Alias]):
    """Reads aliases, with the filters the aliases module uses by name."""

    def __init__(self, database: Database, tables: Tables, kept: KeptRows) -> None:
        super().__init__(database, tables, Alias)
        self.kept = kept

    def saved(self, name: str) -> Alias | None:
        return self.kept.read(self.table.name, self.with_name(name).first, "name = ?", [name], name="aliases.row")

    def with_name(self, name: str) -> Self:
        return self.filter(name=name)
