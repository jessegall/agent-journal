import json

from engine.database.kept_rows import KeptRows
from engine.query.queries import Queries
from core.modules.environments.models.environment import Environment
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.models.plugin_setting import PluginSetting
from core.modules.plugins.support.plugin_manifest import PluginManifest


class PluginSettings:
    """A plugin's settings as its program reads them: each declared setting's default, overridden by the value
    the user gave it; the values the user gave are kept while they do not change."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def values(self, plugin: Plugin, manifest: PluginManifest, environment: str) -> dict[str, object]:
        settings = self.queries.query(PluginSetting).filter(plugin_id=plugin.id)
        rows = self.kept.read(settings, lambda: tuple(settings.get()), name="plugins.settings")
        environments = self.queries.query(Environment).filter(name=environment)
        selected = self.kept.read(environments, environments.first, name="plugins.setting_environment") if environment else None
        given = {row.key: json.loads(row.value) for row in rows if row.environment_id is None}
        if selected is not None:
            given.update({row.key: json.loads(row.value) for row in rows if row.environment_id == selected.id})
        return {setting.key: given[setting.key] if setting.key in given else setting.default for setting in manifest.settings}
