from engine.database.migration import Migration


class LiveCheckIndexMigration(Migration):
    """Indexes the checks that are not removed by id, so walking them in order reads only the live ones."""

    number = 9
    statements = ["CREATE INDEX IF NOT EXISTS checks_live ON checks (id) WHERE removed_at IS NULL"]
