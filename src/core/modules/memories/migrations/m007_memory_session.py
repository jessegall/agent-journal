from engine.database.migration import Migration


class MemorySessionMigration(Migration):
    """Names the column that holds the agent of the session a row belongs to."""

    number = 7
    statements = ["ALTER TABLE memory_marks RENAME COLUMN agent_id TO session_agent_id",
                  "ALTER TABLE memory_deliveries RENAME COLUMN agent_id TO session_agent_id"]
