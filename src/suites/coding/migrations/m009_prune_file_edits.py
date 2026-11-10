from engine.database.migration import Migration

ROWS_KEPT = 1000


class PruneFileEditsMigration(Migration):
    """Indexes the file edits by environment, removes those under graphify-out and dist folders, and all but the
    newest 1000 of the rest."""

    number = 9
    statements = ["CREATE INDEX IF NOT EXISTS file_edits_environment ON file_edits (environment_id, id)",
                  "DELETE FROM file_edits WHERE path LIKE 'graphify-out/%' OR path LIKE 'dist/%' OR path LIKE '%/dist/%'",
                  f"DELETE FROM file_edits WHERE id NOT IN (SELECT id FROM file_edits ORDER BY id DESC LIMIT {ROWS_KEPT})"]
