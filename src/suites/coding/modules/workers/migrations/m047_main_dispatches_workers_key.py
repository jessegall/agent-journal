from engine.database.migration import Migration


class MainDispatchesWorkersKeyMigration(Migration):
    """Renames the setting that lets the main agent send workers, which still carried the builder's name."""

    number = 47
    statements = ["UPDATE settings SET key = 'journal.suites.coding.workers.main-dispatches-workers' WHERE key = 'journal.suites.coding.workers.builder-dispatches-workers'"]
