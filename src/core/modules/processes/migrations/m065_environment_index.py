from engine.database.migration import Migration


class ReadersEnvironmentIndexMigration(Migration):
    """Indexes readers by environment, so the list of one environment reads no other row."""

    number = 65
    statements = [
        "CREATE INDEX readers_environment ON readers (environment_id, id)",
    ]
