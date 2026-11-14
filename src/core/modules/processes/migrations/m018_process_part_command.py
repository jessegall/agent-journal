from engine.database.migration import Migration


class ProcessPartCommandMigration(Migration):
    """Each process part keeps the command its alias names."""

    number = 18
    statements = ["ALTER TABLE process_parts ADD COLUMN command TEXT NOT NULL DEFAULT ''"]
