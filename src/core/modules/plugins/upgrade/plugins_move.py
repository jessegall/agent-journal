from engine.file.file_access import FileAccess
import json
import sqlite3
from pathlib import Path

from engine.database.database import Database
from engine.database.row_insert import RowInsert
from engine.types.type_guards import is_mapping
from engine.upgrade.move_context import MoveContext
from engine.upgrade.move_map import MoveMap
from engine.upgrade.move_report import MoveReport
from engine.upgrade.table_copy_move import TableCopyMove
from engine.upgrade.version_four_source import VersionFourSource
from core.modules.plugins.support.plugin_digest import PluginDigest
from core.modules.plugins.support.plugin_manifest import PluginManifest

TABLE = "plugins"


class PluginsMove(TableCopyMove):
    """Preserves installed plugins and their settings, and reports how to update or restore them."""

    name = "plugins"
    table = TABLE
    reads = [TABLE]
    id_modules = ["journal.core.actors"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report = super().move(source, target, map, context)
        for row in source.rows(TABLE):
            name, release = row["name"], row["release"] or "(no release recorded)"
            report.note(f"kept plugin {name} {release}; plugins are not upgraded automatically. Check: journal plugin latest {name}; preview: journal plugin upgrade {name}; apply: journal plugin upgrade {name} --yes")
            folder = Path(context.journal_folder) / "plugins" / name
            if not FileAccess.is_dir(folder):
                report.note(f"plugin {name} is switched off because its folder is missing; restore {folder}, then journal plugin enable {name}")
        return report

    def insert(self, rows: RowInsert, row: sqlite3.Row, creator_id: int, context: MoveContext) -> int:
        manifest, folder = self.settings(row["manifest"]), Path(context.journal_folder) / "plugins" / row["name"]
        created = row["created_at"] or context.timestamp
        plugin_id = rows.insert(TABLE, {"id": row["id"], "creator_id": creator_id, "name": row["name"], "title": str(manifest["title"] if "title" in manifest else row["name"]),
                                   "source": row["source"], "release": row["release"] or "", "enabled": int(bool(row["enabled"]) and not row["is_user_disabled"] and FileAccess.is_dir(folder)),
                                   "files_digest": PluginDigest.digest(folder, PluginManifest.read(folder)) if FileAccess.is_dir(folder) else "",
                                   "created_at": created, "updated_at": row["updated_at"] or created})
        for key, value in self.settings(row["settings"]).items():
            rows.insert("plugin_settings", {"plugin_id": plugin_id, "creator_id": creator_id, "key": key, "value": json.dumps(value), "created_at": created, "updated_at": created})
        return plugin_id

    def settings(self, text: str | None) -> dict[str, object]:
        parsed: object = json.loads(text) if text else None
        return {str(key): value for key, value in parsed.items()} if is_mapping(parsed) else {}
