from engine.database.kept_rows import KeptRows
from engine.query.queries import Queries
from core.modules.plugins.models.plugin import Plugin
from core.modules.processes.support.installed_plugins import InstalledPlugins

INSTALLED_REASON = "the plugins installed are few, and every class of a plugin asks after them"


class PluginInstalledNames(InstalledPlugins):
    """The names of the plugins installed in the project, read from their rows and kept until a row changes."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def names(self) -> frozenset[str] | None:
        plugins = self.queries.query(Plugin)
        return self.kept.read(plugins, lambda: frozenset(plugin.name for plugin in plugins.every_row(INSTALLED_REASON)), name="plugins.installed_names")
