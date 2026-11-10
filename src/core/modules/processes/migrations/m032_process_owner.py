from engine.database.migration import Migration


class ProcessOwnerMigration(Migration):
    """Records the agent responsible for a run started by another agent."""

    number = 32
    statements = ["ALTER TABLE processes ADD COLUMN owner_agent_id INTEGER REFERENCES agents(id)"]
