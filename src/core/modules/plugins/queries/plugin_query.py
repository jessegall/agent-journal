from core.base.database.database import Database
from core.base.database.kept_rows import KeptRows
from engine.model.tables import Tables
from engine.query.query import Query
from engine.errors.refusal import Refusal
from core.modules.plugins.models.plugin import Plugin


class PluginQuery(Query[Plugin]):
    """Reads plugins: one by its name, and the ones switched on in the order they were installed."""

    def __init__(self, database: Database, tables: Tables, kept: KeptRows) -> None:
        super().__init__(database, tables, Plugin)
        self.kept = kept

    def find_name(self, name: str) -> Plugin:
        plugin = self.kept.read(self.table.name, lambda: self.filter(name=name).first(), "name = ?", [name], name="plugins.find_name")
        if plugin is None:
            raise Refusal(f"no plugin named {name} is installed", "journal plugin list shows them")
        return plugin

    def enabled_plugins(self) -> list[Plugin]:
        return list(self.kept.read(self.table.name, lambda: tuple(self.filter(enabled=True).oldest().all_rows()),
                                   "enabled = ?", [True], name="plugins.enabled_plugins"))

    def is_installed(self, name: str) -> bool:
        return self.kept.read(self.table.name, self.filter(name=name).exists, "name = ?", [name], name="plugins.installed")
