from engine.database.migration import Migration


class WorkSourceSelectionsMigration(Migration):
    """Distinguishes deliberate source selections from bookkeeping updates."""

    number = 19
    statements = ["ALTER TABLE message_work_sources ADD COLUMN selection_number INTEGER NOT NULL DEFAULT 1"]
