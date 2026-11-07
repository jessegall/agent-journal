from core.base.database.migration import Migration


class OpenWaitIndexMigration(Migration):
    """Indexes the open waits."""

    number = 5
    statements = ["CREATE INDEX waits_open ON waits (id) WHERE state = 'open'"]
