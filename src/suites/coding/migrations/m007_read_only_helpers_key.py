from engine.database.migration import Migration


class HelpersKeyMigration(Migration):
    """The setting that lets the main agent start helpers covers read-only helpers alone, so its key now says so."""

    number = 7
    statements = ["UPDATE settings SET key = 'journal.suites.coding.main-starts-read-only-helpers' WHERE key = 'journal.suites.coding.main-starts-helpers'"]
