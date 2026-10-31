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
RENAMED = {"memories.keyword-limit": "journal.core.memories.keyword-limit"}


class SettingsMove(VersionFourMove):
    """Carries a version 4 setting only when a module of version 5 declares a setting of its key, under the
    full name the declaration gives (a renamed key goes through the table above); every other setting is
    skipped and told with its key and value. A project setting stays the project's and an environment's
    keeps its environment, and a key set twice for one scope moves once."""

    name = "settings"
    reads = ["settings"]
    id_modules = ["journal.core.actors", "journal.core.environments"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows, moved_scopes = MoveReport(), CreatorResolver(source, map), RowInsert(target), set[tuple[str, int | None]]()
        for row in source.rows(TABLE):
            key = RENAMED.get(row["key"], row["key"])
            if key not in context.setting_keys:
                report.skip(TABLE, row["id"], f"no module declares the key {row['key']} (value {row['value']})")
            elif (key, row["environment_id"]) in moved_scopes:
                report.skip(TABLE, row["id"], f"the key {key} is already moved for that scope")
            else:
                moved_scopes.add((key, row["environment_id"]))
                report.count(TABLE, map.transfer(TABLE, row["id"], TABLE, lambda: rows.insert(TABLE, {
                    "environment_id": row["environment_id"], "creator_id": creators.actor_id(row["creator"]), "key": key, "value": self.json_text(row["value"]),
                    "created_at": row["created_at"] or context.timestamp, "updated_at": row["updated_at"] or row["created_at"] or context.timestamp})))
        return report

    def json_text(self, value: str) -> str:
        try:
            json.loads(value)
        except ValueError:
            return json.dumps(value)
        return value
