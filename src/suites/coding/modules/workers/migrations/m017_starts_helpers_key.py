from core.base.database.migration import Migration


class StartsHelpersKeyMigration(Migration):
    """The builder's setting has its new key."""

    number = 17
    statements = ["UPDATE settings SET key = 'journal.suites.coding.builder-starts-helpers' WHERE key = 'journal.suites.coding.builder-sends-subagents'",
                  "UPDATE settings SET value = replace(value, 'coding.subagent', 'coding.helper') WHERE key = 'journal.core.drivers.driver.helper'"]
