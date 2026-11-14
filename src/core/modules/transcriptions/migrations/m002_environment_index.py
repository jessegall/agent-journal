from engine.database.migration import Migration


class TranscriptionsEnvironmentIndexMigration(Migration):
    """Indexes transcriptions by environment, so the list of one environment reads no other row."""

    number = 2
    statements = [
        "CREATE INDEX transcriptions_environment ON transcriptions (environment_id, id)",
    ]
