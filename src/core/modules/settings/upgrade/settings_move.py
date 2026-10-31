import json

from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from core.base.upgrade.creator_resolver import CreatorResolver
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_source import VersionFourSource

TABLE = "settings"
LAYOUT_KEYS = ("layout", "inspector_layout", "worker_layout", "viewer.layout", "viewer.inspector_layout", "viewer.worker_layout")
RENAMED = {"memories.keyword-limit": "journal.core.memories.keyword-limit", "workers.most_out": "journal.suites.coding.workers.most-out",
           "workers.builder_may_dispatch": "journal.suites.coding.workers.builder-dispatches-workers",
           "workers.command_kinds": "journal.suites.coding.worker-command-types"}
LISTED = ("journal.suites.coding.worker-command-types",)


class SettingsMove(VersionFourMove):
    """Carries a version 4 setting only when a module of version 5 declares a setting of its key, under the
    full name the declaration gives (a renamed key goes through the table above); every other setting is
    skipped and told with its key and value. A project setting stays the project's and an environment's
    keeps its environment, and a key set twice for one scope moves once."""

    name = "settings"
    reads = ["settings"]
    id_modules = ["journal.core.actors", "journal.core.environments"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows, moved_scopes = MoveReport(), CreatorResolver(target, map), RowInsert(target), set[tuple[str, int | None]]()
        for row in [row for row in source.rows(TABLE) if row["key"] not in LAYOUT_KEYS]:
            key = self.renamed(row["key"])
            if key not in context.setting_keys:
                report.skip(TABLE, row["id"], f"no module declares the key {row['key']} (value {row['value']})")
            elif (key, row["environment_id"] or None) in moved_scopes:
                report.skip(TABLE, row["id"], f"the key {key} is already moved for that scope")
            else:
                moved_scopes.add((key, row["environment_id"] or None))
                report.count(TABLE, map.transfer(TABLE, row["id"], TABLE, lambda: rows.insert(TABLE, {
                    "environment_id": row["environment_id"] or None, "creator_id": creators.actor_id(row["creator"]), "key": key, "value": self.stored(key, row["value"]),
                    "created_at": row["created_at"] or context.timestamp, "updated_at": row["updated_at"] or row["created_at"] or context.timestamp})))
        return report

    def renamed(self, key: str) -> str:
        return RENAMED.get(key, key)

    def stored(self, key: str, value: str) -> str:
        text = self.json_text(value)
        if key not in LISTED:
            return text
        loaded = json.loads(text)
        return json.dumps([item.strip() for item in loaded.split(",") if item.strip()] if isinstance(loaded, str) else loaded)

    def json_text(self, value: str) -> str:
        try:
            json.loads(value)
        except ValueError:
            return json.dumps(value)
        return value
