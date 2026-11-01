import json
from weakref import WeakKeyDictionary

from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.query.queries import Queries
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.models.plugin_setting import PluginSetting
from core.modules.plugins.support.plugin_manifest import PluginManifest

SIGNATURE_SQL = "SELECT count(*), max(updated_at) FROM plugin_settings WHERE plugin_id = ?"
KEPT: WeakKeyDictionary[Database, dict[int, tuple[tuple[int, str], dict[str, object]]]] = WeakKeyDictionary()


class PluginSettings:
    """A plugin's settings as its program reads them: each declared setting's default, overridden by the value the
    person gave it; the values the person gave are kept on the connection while their count and newest change time
    stay the same, so a hook asks for them one row at a time and not for every one."""

    def __init__(self, queries: Queries, database: Database) -> None:
        self.queries, self.database = queries, database

    def values(self, plugin: Plugin, manifest: PluginManifest) -> dict[str, object]:
        given = self.given(plugin)
        return {setting.key: given[setting.key] if setting.key in given else setting.default for setting in manifest.settings}

    def given(self, plugin: Plugin) -> dict[str, object]:
        count, newest = self.database.rows(Statement(SIGNATURE_SQL, [plugin.id]))[0]
        signature = (count, newest or "")
        kept = KEPT.setdefault(self.database, {})
        if plugin.id in kept and kept[plugin.id][0] == signature:
            return kept[plugin.id][1]
        given = {row.key: json.loads(row.value) for row in self.queries.query(PluginSetting).filter(plugin_id=plugin.id).all_rows()}
        kept[plugin.id] = (signature, given)
        return given
