from core.base.database.migration import Migration


class BlockStopNameMigration(Migration):
    """Renames the flag for a block that prevents an agent from stopping."""

    number = 20
    statements = ["ALTER TABLE agent_blocks RENAME COLUMN stop_only TO blocks_stop"]
