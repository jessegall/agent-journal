from engine.database.migration import Migration


class PluginSessionMigration(Migration):
    """Names the column that holds the agent of the session a row belongs to."""

    number = 4
    statements = ["ALTER TABLE plugin_outputs RENAME COLUMN agent_id TO session_agent_id",
                  "ALTER TABLE plugin_deliveries RENAME COLUMN agent_id TO session_agent_id"]
