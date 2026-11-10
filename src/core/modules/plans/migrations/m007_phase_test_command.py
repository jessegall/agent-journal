from engine.database.migration import Migration


class PhaseTestCommandMigration(Migration):
    """A phase can name a test command that runs at its end."""

    number = 7
    statements = ["ALTER TABLE phases ADD COLUMN test_command TEXT NOT NULL DEFAULT ''"]
