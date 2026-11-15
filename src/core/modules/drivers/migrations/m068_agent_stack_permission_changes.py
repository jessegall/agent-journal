from engine.database.migration import Migration


class AgentStackPermissionChangesMigration(Migration):
    """Gives an agent's stack row the count of the writes that changed what the agent may do, so each such write
    moves the stack's version in its own transaction (doc 1310 section 6.5)."""

    number = 68
    statements = ["ALTER TABLE agent_stacks ADD COLUMN permission_changes INTEGER NOT NULL DEFAULT 0"]
