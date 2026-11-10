from engine.database.migration import Migration


class OpenCheckHiddenIndexMigration(Migration):
    """Indexes visible active checks in row order."""

    number = 8
    statements = ["CREATE INDEX checks_open_hidden ON checks (hidden, id) WHERE removed_at IS NULL"]
