from engine.database.migration import Migration


class CountdownCapNameMigration(Migration):
    """Renames the block column that holds how many uses remain when its countdown is first shown."""

    number = 49
    statements = ["ALTER TABLE agent_blocks RENAME COLUMN countdown_from TO countdown_limit"]
