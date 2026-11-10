import json

from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from engine.upgrade.creator_resolver import CreatorResolver
from engine.upgrade.move_context import MoveContext
from engine.upgrade.move_map import MoveMap
from engine.upgrade.move_report import MoveReport
from engine.upgrade.version_four_move import VersionFourMove
from engine.upgrade.version_four_source import VersionFourSource

TABLE = "settings"
RENAMED = {"viewer.tour_seen": "journal.core.viewer.tour-completed", "memories.keyword-limit": "journal.core.memories.keyword-limit", "profiles.model.claude": "journal.core.profiles.model-claude",
           "profiles.model.codex": "journal.core.profiles.model-codex", "voices.profile": "journal.core.voices.profile", "voices.title": "journal.core.voices.title",
           "voices.name": "journal.core.voices.name", "voices.avatar": "journal.core.voices.avatar", "voices.avatar_shown": "journal.core.voices.avatar-shown"}
FEATURE_FLAG_REASON = "version 5 chooses features through modules and the suite instead of feature switches"
DROPPED_REASONS = {
    **dict.fromkeys(("features.sequences", "features.sharing", "features.templates", "features.triggers"), FEATURE_FLAG_REASON),
}


class SettingsMove(VersionFourMove):
    """Moves declared settings and reports each unsupported key, value and reason."""

    name = "settings"
    reads = ["settings"]
    id_modules = ["journal.core.actors", "journal.core.environments"]
    key_replacements = RENAMED
    unsupported_keys = DROPPED_REASONS

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows, moved_scopes = MoveReport(), CreatorResolver(target, map), RowInsert(target), set[tuple[str, int | None]]()
        for row in [row for row in source.rows(TABLE) if self.accepts_key(row["key"], context)]:
            key = self.renamed(row["key"])
            if key not in context.setting_keys:
                explanation = self.unsupported_keys.get(row["key"], "version 5 does not declare this setting")
                report.skip(TABLE, row["id"], f"no module declares the key {row['key']} (value {row['value']}); dropped: {explanation}")
            elif (key, row["environment_id"] or None) in moved_scopes:
                report.skip(TABLE, row["id"], f"the key {key} is already moved for that scope")
            else:
                moved_scopes.add((key, row["environment_id"] or None))
                report.count(TABLE, map.transfer(TABLE, row["id"], TABLE, lambda: rows.insert(TABLE, {
                    "environment_id": row["environment_id"] or None, "creator_id": creators.actor_id(row["creator"]), "key": key, "value": self.stored(key, row["value"]),
                    "created_at": row["created_at"] or context.timestamp, "updated_at": row["updated_at"] or row["created_at"] or context.timestamp})))
        return report

    def renamed(self, key: str) -> str:
        return self.key_replacements.get(key, key)

    def accepts_key(self, key: str, context: MoveContext) -> bool:
        return key in self.setting_keys if self.setting_keys else key not in context.reserved_setting_keys

    def stored(self, key: str, value: str) -> str:
        return self.json_text(value)

    def json_text(self, value: str) -> str:
        try:
            json.loads(value)
        except ValueError:
            return json.dumps(value)
        return value
