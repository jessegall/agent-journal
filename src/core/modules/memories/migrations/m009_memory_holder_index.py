from engine.database.migration import Migration


class MemoryHolderIndexMigration(Migration):
    """Lets the count of each agent's kept and removed memories read the index alone."""

    number = 9
    statements = ["CREATE INDEX memories_agent_state ON memories (agent_id, state)"]
