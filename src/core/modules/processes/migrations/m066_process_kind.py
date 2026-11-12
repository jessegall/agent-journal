from engine.database.migration import Migration


class ProcessKindMigration(Migration):
    """Gives a process the kind its plugin declared for it, so the runs of one kind can be limited apart."""

    number = 66
    statements = ["ALTER TABLE processes ADD COLUMN kind TEXT NOT NULL DEFAULT ''"]
