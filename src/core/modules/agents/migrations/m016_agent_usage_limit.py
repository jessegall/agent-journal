from core.base.database.migration import Migration


class AgentUsageCapMigration(Migration):
    """Adds the moment an agent's program plan allowance starts again, while the agent waits at the
    allowance's limit."""

    number = 16
    statements = ["ALTER TABLE agents ADD COLUMN limited_until TEXT"]
