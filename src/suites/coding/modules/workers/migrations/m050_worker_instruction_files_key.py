from core.base.database.migration import Migration


class WorkerInstructionFilesKeyMigration(Migration):
    """The setting for the instruction files of a worker's profile moves from the profiles module to the
    workers module."""

    number = 50
    statements = ["UPDATE settings SET key = 'journal.suites.coding.workers.worker-instruction-files' WHERE key = 'journal.core.profiles.worker-instruction-files'"]
