from engine.database.migration import Migration


class ProcessHookCallIndexMigration(Migration):
    """Indexes the processes by the hook call that started them, so deleting an old hook call finds its processes
    without reading the whole table."""

    number = 72
    statements = ["CREATE INDEX IF NOT EXISTS processes_hook_call ON processes (hook_call_id) WHERE hook_call_id IS NOT NULL"]
