from engine.database.migration import Migration


class WorkerRowsEnvironmentIndexMigration(Migration):
    """Indexes worker task sources, worker assignments and merger advices by environment, so the list of one environment reads no other row."""

    number = 76
    statements = [
        "CREATE INDEX worker_task_sources_environment ON worker_task_sources (environment_id, id)",
        "CREATE INDEX worker_assignments_environment ON worker_assignments (environment_id, id)",
        "CREATE INDEX merger_advices_environment ON merger_advices (environment_id, id)",
    ]
