from engine.database.migration import Migration


class PhasePersonCheckMigration(Migration):
    """A checkpoint phase waits for a person only when it was made to."""

    number = 19
    statements = ["ALTER TABLE phases ADD COLUMN person_check INTEGER NOT NULL DEFAULT 0"]
