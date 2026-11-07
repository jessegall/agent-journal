from core.base.database.migration import Migration


class AgentAccessMigration(Migration):
    """An agent has an access; existing rows stay writing, and a reviewer reads."""

    number = 9
    statements = ["ALTER TABLE agents ADD COLUMN access TEXT NOT NULL DEFAULT 'writing'",
                  "UPDATE agents SET access = 'read-only' WHERE role = 'reviewer'"]
