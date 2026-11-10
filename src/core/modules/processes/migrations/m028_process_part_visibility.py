from engine.database.migration import Migration


class ProcessPartVisibilityMigration(Migration):
    """Stores whether a part makes its run visible."""

    number = 28
    statements = ["ALTER TABLE process_parts ADD COLUMN is_visible INTEGER NOT NULL DEFAULT 0",
                  "UPDATE process_parts SET is_visible = 1 WHERE category IN ('test run', 'build')"]
