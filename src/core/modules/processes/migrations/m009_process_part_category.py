from core.base.database.migration import Migration


class ProcessPartCategoryMigration(Migration):
    """Each part of a line keeps what type of command it is, so a mark can name the one command it is for."""

    number = 9
    statements = tuple(["ALTER TABLE process_parts ADD COLUMN category TEXT NOT NULL DEFAULT 'unknown'"])
