from core.base.database.migration import Migration


class TriggerEnablingMigration(Migration):
    """Lets a trigger an agent made wait for the user to enable it."""

    number = 3
    statements = ["ALTER TABLE triggers ADD COLUMN needs_enabling INTEGER NOT NULL DEFAULT 0"]
