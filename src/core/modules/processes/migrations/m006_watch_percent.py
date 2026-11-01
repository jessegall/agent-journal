from core.base.database.migration import Migration


class WatchPercentMigration(Migration):
    """A watch keeps the percent it last told the agent of, in place of the lines it gave."""

    number = 6
    statements = tuple(["ALTER TABLE watches RENAME COLUMN given_lines TO given_percent", "UPDATE watches SET given_percent = 0"])
