from engine.database.migration import Migration


class SequenceRunsEnvironmentIndexMigration(Migration):
    """Indexes sequence runs by environment, so the list of one environment reads no other row."""

    number = 9
    statements = [
        "CREATE INDEX sequence_runs_environment ON sequence_runs (environment_id, id)",
    ]
