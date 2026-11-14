from engine.database.migration import Migration


class DroppedProcessShellMigration(Migration):
    """Drops the shell column of processes, which no start ever filled."""

    number = 77
    statements = ["ALTER TABLE processes DROP COLUMN shell"]
