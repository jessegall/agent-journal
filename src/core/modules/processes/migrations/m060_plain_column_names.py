from engine.database.migration import Migration


class PlainColumnNamesMigration(Migration):
    """Renames the columns whose names were not plain words."""

    number = 60
    statements = ["ALTER TABLE outputs RENAME COLUMN seen_offset TO displayed_offset",
                  "ALTER TABLE watches RENAME COLUMN woke_at TO notified_at"]
