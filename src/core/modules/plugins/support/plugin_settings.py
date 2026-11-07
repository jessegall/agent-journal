import json

from core.base.database.kept_rows import KeptRows
from core.base.query.queries import Queries
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.models.plugin_setting import PluginSetting
from core.modules.plugins.support.plugin_manifest import PluginManifest


class PluginSettings:
    """A plugin's settings as its program reads them: each declared setting's default, overridden by the value
    the person gave it; the values the person gave are kept while they do not change."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def values(self, plugin: Plugin, manifest: PluginManifest) -> dict[str, object]:
        rows = self.kept.read("plugin_settings", lambda: tuple(self.queries.query(PluginSetting).filter(plugin_id=plugin.id).all_rows()), "plugin_id = ?", [plugin.id], name="plugins.settings")
        given = {row.key: json.loads(row.value) for row in rows}
        return {setting.key: given[setting.key] if setting.key in given else setting.default for setting in manifest.settings}
