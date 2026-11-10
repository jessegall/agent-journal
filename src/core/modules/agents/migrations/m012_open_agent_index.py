from engine.database.migration import Migration


class OpenAgentIndexMigration(Migration):
    """Indexes the agents that have not ended."""

    number = 12
    statements = ["CREATE INDEX agents_open ON agents (id) WHERE ended_at IS NULL"]
