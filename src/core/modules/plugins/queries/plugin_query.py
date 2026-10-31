from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.query import Query
from core.base.refusal import Refusal
from core.modules.plugins.models.plugin import Plugin


class PluginQuery(Query[Plugin]):
    """Reads plugins: one by its name, and the ones switched on in the order they were installed."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Plugin)

    def find_name(self, name: str) -> Plugin:
        rows = self.filter(name=name).page(1, 1).rows
        if not rows:
            raise Refusal(f"no plugin named {name} is installed", "journal plugin list shows them")
        return rows[0]

    def enabled_ones(self) -> list[Plugin]:
        return list(self.filter(enabled=True).oldest().all_rows())

    def is_installed(self, name: str) -> bool:
        return self.filter(name=name).exists()
