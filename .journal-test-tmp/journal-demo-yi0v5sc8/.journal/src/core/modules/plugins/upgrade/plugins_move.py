import json
import sqlite3
from pathlib import Path

from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from core.base.type_guards import is_mapping
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.table_copy_move import TableCopyMove
from core.base.upgrade.version_four_source import VersionFourSource
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
            if not folder.is_dir():
                report.note(f"plugin {name} is switched off because its folder is missing; restore {folder}, then journal plugin enable {name}")
        return report

    def insert(self, rows: RowInsert, row: sqlite3.Row, creator_id: int, context: MoveContext) -> int:
        manifest, folder = self.settings(row["manifest"]), Path(context.journal_folder) / "plugins" / row["name"]
        created = row["created_at"] or context.timestamp
        plugin_id = rows.insert(TABLE, {"id": row["id"], "creator_id": creator_id, "name": row["name"], "title": str(manifest["title"] if "title" in manifest else row["name"]),
                                   "source": row["source"], "release": row["release"] or "", "enabled": int(bool(row["enabled"]) and not row["is_user_disabled"] and folder.is_dir()),
                                   "files_digest": PluginDigest.digest(folder, PluginManifest.read(folder)) if folder.is_dir() else "",
                                   "created_at": created, "updated_at": row["updated_at"] or created})
        for key, value in self.settings(row["settings"]).items():
            rows.insert("plugin_settings", {"plugin_id": plugin_id, "creator_id": creator_id, "key": key, "value": json.dumps(value), "created_at": created, "updated_at": created})
        return plugin_id

    def settings(self, text: str | None) -> dict[str, object]:
        parsed: object = json.loads(text) if text else None
        return {str(key): value for key, value in parsed.items()} if is_mapping(parsed) else {}
