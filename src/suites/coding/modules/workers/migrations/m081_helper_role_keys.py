import json
from pathlib import Path

from engine.database.database import Database
from engine.database.migration import Migration
from engine.enums.log_level import LogLevel
from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome
from engine.log.system_log_writer import SystemLogWriter
from engine.time.clock import Clock

RETIRED_ROLES = ("verifier", "reviewer")
PLUGIN_NAMES = "SELECT name FROM plugins ORDER BY name LIMIT 1000"
MANIFEST_NAME = "journal-plugin.json"


class HelperRoleKeysMigration(Migration):
    """Stores the keys of the helper classes: a verifier or a reviewer becomes a helper, keeping its number,
    history and end, and a helper started with the merger profile becomes a merger. Each statement selects only
    rows of an old key, so a run that stopped half way, or a second run, writes no row twice. A plugin whose
    manifest reaches a retired role is listed in the system log, since its manifest is not ours to rewrite."""

    number = 81
    statements = ["UPDATE agents SET role = 'helper' WHERE role IN ('verifier', 'reviewer')",
                  "UPDATE agents SET role = 'merger' WHERE role = 'helper' AND profile = 'journal-merger'"]

    def run(self, database: Database) -> None:
        super().run(database)
        database_file = self.database_file(database)
        if not database_file:
            return
        home = JournalHome(Path(database_file).parent)
        log = SystemLogWriter(home, Clock())
        for name, reach in self.retired_reaches(database, home):
            log.write(LogLevel.WARNING, f"plugin {name} reaches {reach}, which the role migration made helpers")

    def retired_reaches(self, database: Database, home: JournalHome) -> list[tuple[str, str]]:
        names = [str(row[0]) for row in self.selected(database, PLUGIN_NAMES, ())]
        manifests = [(name, home.folder / "plugins" / name / MANIFEST_NAME) for name in names]
        reaches = [(name, json.loads(FileAccess.shared().read(path)).get("reaches", {})) for name, path in manifests if path.exists()]
        return [(name, reach) for name, reached in reaches for roles in reached.values() for reach in roles
                if reach.removesuffix("s") in RETIRED_ROLES]
