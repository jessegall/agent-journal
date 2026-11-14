from engine.database.migration import Migration


class AliasAgentAccessMigration(Migration):
    """Records permission to run an alias for roles restricted by their suite."""

    number = 3
    statements = ["ALTER TABLE aliases ADD COLUMN agent_access INTEGER NOT NULL DEFAULT 0"]
