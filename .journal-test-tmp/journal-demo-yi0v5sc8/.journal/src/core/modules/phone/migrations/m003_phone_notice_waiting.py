from core.base.database.migration import Migration


class PhoneNoticeWaitingMigration(Migration):
    """Adds the mark that a notice waits to be pushed to a paired phone."""

    number = 3
    statements = (
        "ALTER TABLE phones ADD COLUMN notice_waiting INTEGER NOT NULL DEFAULT 0 CHECK (notice_waiting IN (0, 1))",
    )
