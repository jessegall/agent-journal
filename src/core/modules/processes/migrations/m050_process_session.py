from core.base.database.migration import Migration


class ProcessSessionMigration(Migration):
    """Names the column that holds the agent of the session a row belongs to."""

    number = 50
    statements = ["ALTER TABLE watches RENAME COLUMN agent_id TO session_agent_id",
                  "ALTER TABLE processes RENAME COLUMN agent_id TO session_agent_id"]
