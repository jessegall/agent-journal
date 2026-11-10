from engine.database.migration import Migration


class MainStartsHelpersKeyMigration(Migration):
    """Renames the setting that lets the main agent start ordinary helpers, which still carried the builder's name."""

    number = 6
    statements = ["UPDATE settings SET key = 'journal.suites.coding.main-starts-helpers' WHERE key = 'journal.suites.coding.builder-starts-helpers'"]
