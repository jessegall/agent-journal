from engine.database.migration import Migration


class AgentRoleIndexMigration(Migration):
    """Indexes agent roles for reads that exclude helpers."""

    number = 7
    statements = ["CREATE INDEX agents_role ON agents (role)"]
