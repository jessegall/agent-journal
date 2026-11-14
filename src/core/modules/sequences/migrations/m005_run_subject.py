from engine.database.migration import Migration


class RunSubjectMigration(Migration):
    """A sequence run keeps the number of the row that started it."""

    number = 5
    statements = ["ALTER TABLE sequence_runs ADD COLUMN subject_id INTEGER"]
