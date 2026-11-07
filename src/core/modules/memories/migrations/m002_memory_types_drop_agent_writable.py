from core.base.database.migration import Migration


class MemoryTypesDropAgentWritableMigration(Migration):
    """Drops the column that said whether an agent may make a memory of a type, as an agent may make any."""

    number = 2
    statements = ["ALTER TABLE memory_types DROP COLUMN agent_writable"]
