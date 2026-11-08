from core.base.database.migration import Migration


class AgentInterruptMigration(Migration):
    """Adds the moment the launcher saw an agent's turn interrupted, kept until the agent is woken or the
    interrupt is dropped."""

    number = 17
    statements = ["ALTER TABLE agents ADD COLUMN interrupted_at TEXT"]
