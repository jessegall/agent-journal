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
RENAMED = {"viewer.tour_seen": "journal.core.viewer.tour-completed", "memories.keyword-limit": "journal.core.memories.keyword-limit", "workers.most_out": "journal.suites.coding.workers.worker-limit",
           "workers.builder_may_dispatch": "journal.suites.coding.workers.builder-dispatches-workers",
           "workers.command_kinds": "journal.suites.coding.worker-command-types", "profiles.model.claude": "journal.core.profiles.model-claude",
           "profiles.model.codex": "journal.core.profiles.model-codex", "voices.profile": "journal.core.voices.profile", "voices.title": "journal.core.voices.title",
           "voices.name": "journal.core.voices.name", "voices.avatar": "journal.core.voices.avatar", "voices.avatar_shown": "journal.core.voices.avatar-shown"}
LISTED_KEY = "journal.suites.coding.worker-command-types"
FEATURE_FLAG_REASON = "version 5 chooses features through modules and the suite instead of feature switches"
TEST_COMMAND_REASON = "test commands now belong to each proof; supply the project command with journal proof make --test"
DROPPED_REASONS = {
    **dict.fromkeys(("features.checks", "features.sequences", "features.sharing", "features.templates", "features.triggers"), FEATURE_FLAG_REASON),
    "plans.test_commands": TEST_COMMAND_REASON,
    "workers.test_command": TEST_COMMAND_REASON,
    "workers.test_command_proof": "this test argument must be combined with the project test command in journal proof make --test",
    "workers.builder_may_queue": "version 5 has no separate builder queue permission; workers receive task queues through dispatch and send",
    "workers.mode": "the mode was chosen per person; version 5 chooses a driver for each environment with journal driver choose",
}


class SettingsMove(VersionFourMove):
    """Moves declared settings and reports each unsupported key, value and reason."""

    name = "settings"
    reads = ["settings"]
    id_modules = ["journal.core.actors", "journal.core.environments"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows, moved_scopes = MoveReport(), CreatorResolver(target, map), RowInsert(target), set[tuple[str, int | None]]()
        for row in [row for row in source.rows(TABLE) if row["key"] not in LAYOUT_KEYS]:
            key = self.renamed(row["key"])
            if key not in context.setting_keys:
                explanation = DROPPED_REASONS.get(row["key"], "version 5 does not declare this setting")
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
        return RENAMED.get(key, key)

    def stored(self, key: str, value: str) -> str:
        text = self.json_text(value)
        if key != LISTED_KEY:
            return text
        loaded = json.loads(text)
        return json.dumps([item.strip() for item in loaded.split(",") if item.strip()] if isinstance(loaded, str) else loaded)

    def json_text(self, value: str) -> str:
        try:
            json.loads(value)
        except ValueError:
            return json.dumps(value)
        return value
