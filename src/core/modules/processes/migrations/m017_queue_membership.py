from pathlib import Path

from engine.database.database import Database
from engine.database.migration import Migration
from engine.database.statement import Statement
from engine.journal.journal_home import JournalHome
from core.modules.processes.support.output_folder import OutputFolder

READ_SIZE = 200


class QueueMembershipMigration(Migration):
    """Keeps queue membership after admission and recovers active runs from their existing slot files."""

    number = 17
    statements = ["ALTER TABLE processes ADD COLUMN is_queue_run INTEGER NOT NULL DEFAULT 0",
                  "UPDATE processes SET is_queue_run = 1 WHERE is_queued = 1"]

    def run(self, database: Database) -> None:
        super().run(database)
        database_file = self.database_file(database)
        if not database_file:
            return
        folder = OutputFolder(JournalHome(Path(database_file).parent))
        last_id = 0
        while rows := self.selected(database, ("SELECT id FROM processes WHERE id > ? AND state IN ('running', 'background')"
                                              " AND is_queue_run = 0 ORDER BY id LIMIT ?"), [last_id, READ_SIZE]):
            for row in rows:
                process_id = row[0]
                if isinstance(process_id, int) and folder.has_slot(process_id):
                    database.update(Statement("UPDATE processes SET is_queue_run = 1 WHERE id = ?", [row[0]]))
            last_id = rows[-1][0]
