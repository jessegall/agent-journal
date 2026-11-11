from engine.database.migration import Migration


class PlanContextReadsEnvironmentIndexMigration(Migration):
    """Indexes plan context reads by environment, so the list of one environment reads no other row."""

    number = 12
    statements = [
        "CREATE INDEX plan_context_reads_environment ON plan_context_reads (environment_id, id)",
    ]
