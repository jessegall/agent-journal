from core.base.database.migration import Migration


class StrictBlocksMigration(Migration):
    """Adds strict blocks, which let through nothing but reading a skill."""

    number = 18
    statements = ["ALTER TABLE agent_blocks ADD COLUMN strict INTEGER NOT NULL DEFAULT 0"]
