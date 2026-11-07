from core.base.database.migration import Migration


class DockItemSessionMigration(Migration):
    """Names the column that holds the agent of the session a row belongs to."""

    number = 8
    statements = ["ALTER TABLE dock_items RENAME COLUMN agent_id TO session_agent_id"]
