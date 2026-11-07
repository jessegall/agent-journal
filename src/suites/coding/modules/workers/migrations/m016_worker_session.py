from core.base.database.migration import Migration


class WorkerSessionMigration(Migration):
    """Names the column that holds the agent of the session a row belongs to."""

    number = 16
    statements = ["ALTER TABLE todo_items RENAME COLUMN agent_id TO session_agent_id",
                  "ALTER TABLE worker_worktrees RENAME COLUMN agent_id TO session_agent_id"]
