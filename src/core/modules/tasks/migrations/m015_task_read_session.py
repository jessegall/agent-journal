from engine.database.migration import Migration


class TaskReadSessionMigration(Migration):
    """Names the column that holds the agent of the session a row belongs to."""

    number = 15
    statements = ["ALTER TABLE task_reads RENAME COLUMN agent_id TO session_agent_id"]
