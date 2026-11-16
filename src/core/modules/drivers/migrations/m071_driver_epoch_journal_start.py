from engine.database.migration import Migration


class DriverVersionJournalStartMigration(Migration):
    """Gives each environment's driver epoch the time the journal last started, which only a start writes; a
    driving setting moves the epoch too, so the row's own time is not the start."""

    number = 71
    statements = ["ALTER TABLE driver_epochs ADD COLUMN started_at TEXT"]
