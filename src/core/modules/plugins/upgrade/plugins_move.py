import json
import sqlite3
from pathlib import Path

from core.base.database.row_insert import RowInsert
from core.base.type_guards import is_mapping
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.table_copy_move import TableCopyMove
from core.modules.plugins.support.plugin_digest import PluginDigest

TABLE = "plugins"


class PluginsMove(TableCopyMove):
    """Carries version 4's installed plugins with their names, sources, releases and on or off, and each setting the
    person gave one as a plugin setting; the plugin's folders stay where both versions keep them, its files' digest
    is taken from them, and a plugin whose folder is gone moves switched off."""

    name = "plugins"
    table = TABLE
    reads = [TABLE]
    id_modules = ["journal.core.actors"]

    def insert(self, rows: RowInsert, row: sqlite3.Row, creator_id: int, context: MoveContext) -> int:
        manifest, folder = self.settings(row["manifest"]), Path(context.journal_folder) / "plugins" / row["name"]
        created = row["created_at"] or context.timestamp
        plugin_id = rows.insert(TABLE, {"id": row["id"], "creator_id": creator_id, "name": row["name"], "title": str(manifest["title"] if "title" in manifest else row["name"]),
                                   "source": row["source"], "release": row["release"] or "", "enabled": int(bool(row["enabled"]) and not row["is_user_disabled"] and folder.is_dir()),
                                   "files_digest": PluginDigest.digest(folder) if folder.is_dir() else "",
                                   "created_at": created, "updated_at": row["updated_at"] or created})
        for key, value in self.settings(row["settings"]).items():
            rows.insert("plugin_settings", {"plugin_id": plugin_id, "creator_id": creator_id, "key": key, "value": json.dumps(value), "created_at": created, "updated_at": created})
        return plugin_id

    def settings(self, text: str | None) -> dict[str, object]:
        parsed: object = json.loads(text) if text else None
        return {str(key): value for key, value in parsed.items()} if is_mapping(parsed) else {}
