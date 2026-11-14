from engine.database.migration import Migration


class MessageWorkSourcesEnvironmentIndexMigration(Migration):
    """Indexes message work sources by environment, so the list of one environment reads no other row."""

    number = 23
    statements = [
        "CREATE INDEX message_work_sources_environment ON message_work_sources (environment_id, id)",
    ]
