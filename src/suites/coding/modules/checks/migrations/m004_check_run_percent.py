from core.base.database.migration import Migration


class CheckRunPercentMigration(Migration):
    """A check keeps how far its running command has come, empty while it does not run."""

    number = 4
    statements = ["ALTER TABLE checks ADD COLUMN run_percent INTEGER"]
