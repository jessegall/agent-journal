from engine.database.migration import Migration


class RequiresEnablingMigration(Migration):
    """A trigger that waits for a person to switch it on says so in requires_enabling, as its field does."""

    number = 8
    statements = ["ALTER TABLE triggers RENAME COLUMN needs_enabling TO requires_enabling"]
