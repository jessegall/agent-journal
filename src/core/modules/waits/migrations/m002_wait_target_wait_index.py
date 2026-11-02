from core.base.database.migration import Migration


class WaitTargetWaitIndexMigration(Migration):
    """The rows a wait waits on are found through an index, as the waiting view lists them for every open
    wait."""

    number = 2
    statements = tuple(["CREATE INDEX wait_targets_wait ON wait_targets (wait_id, row_table)"])
