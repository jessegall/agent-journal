from core.base.database.migration import Migration


class WorkerLogsReadMigration(Migration):
    number = 19
    statements = ["ALTER TABLE worker_worktrees ADD COLUMN logs_read_at TEXT"]
