from engine.database.migration import Migration


class AllowedModelsKeyMigration(Migration):
    """Moves the allowed models setting to the core module that helpers and workers read it from."""

    number = 15
    statements = ["UPDATE settings SET key = 'journal.core.helpers.allowed-models' WHERE key = 'journal.suites.coding.workers.allowed-models'"]
