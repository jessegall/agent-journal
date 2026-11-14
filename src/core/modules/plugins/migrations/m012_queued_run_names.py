from engine.database.migration import Migration


class QueuedRunNamesMigration(Migration):
    """Names the kind of run a plugin queued by run_name."""

    number = 12
    statements = ["ALTER TABLE queued_runs RENAME COLUMN kind TO run_name"]
