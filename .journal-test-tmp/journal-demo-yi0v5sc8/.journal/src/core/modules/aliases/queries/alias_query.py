from typing import Self

from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.query import Query
from core.modules.aliases.models.alias import Alias


class AliasQuery(Query[Alias]):
    """Reads aliases, with the filters the aliases module uses by name."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Alias)

    def with_name(self, name: str) -> Self:
        return self.filter(name=name)
