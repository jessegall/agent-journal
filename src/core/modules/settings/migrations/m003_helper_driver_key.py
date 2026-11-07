from core.base.database.migration import Migration


class HelperDriverKeyMigration(Migration):
    """The helper's driver setting has its new key."""

    number = 3
    statements = ["UPDATE settings SET key = 'journal.core.drivers.driver.helper' WHERE key = 'journal.core.drivers.driver.subagent'"]
