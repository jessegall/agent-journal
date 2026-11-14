from typing import Self

from engine.database.database import Database
from engine.database.kept_rows import KeptRows
from engine.model.tables import Tables
from engine.query.query import Query
from engine.enums.command_category import CommandCategory
from core.modules.aliases.models.alias import Alias

BEGINNING_REASON = "a command is matched against the saved aliases of its category, oldest first, until one begins it"

ALIAS_PAGE_ROWS = 50


class AliasQuery(Query[Alias]):
    """Reads aliases, with the filters the aliases module uses by name."""

    def __init__(self, database: Database, tables: Tables, kept: KeptRows) -> None:
        super().__init__(database, tables, Alias)
        self.kept = kept

    def saved(self, name: str) -> Alias | None:
        aliases = self.with_name(name)
        return self.kept.read(aliases, aliases.first, name="aliases.row")

    def with_name(self, name: str) -> Self:
        return self.filter(name=name)

    def with_category(self, category: CommandCategory) -> Self:
        return self.filter(category=category)

    def first_beginning(self, command: str, category: CommandCategory) -> Alias | None:
        return next((alias for alias in self.with_category(category).every_row(BEGINNING_REASON) if alias.begins(command)), None)
