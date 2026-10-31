import json

from core.base.query.queries import Queries
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.models.plugin_setting import PluginSetting
from core.modules.plugins.support.plugin_manifest import PluginManifest


class PluginSettings:
    """A plugin's settings as its program reads them: each declared setting's default, overridden by the value the
    person gave it."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def values(self, plugin: Plugin, manifest: PluginManifest) -> dict[str, object]:
        given = {row.key: json.loads(row.value) for row in self.queries.query(PluginSetting).filter(plugin_id=plugin.id).all_rows()}
        return {setting.key: given[setting.key] if setting.key in given else setting.default for setting in manifest.settings}
