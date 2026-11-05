from core.base.database.migration import Migration


class DockItemLabelsMigration(Migration):
    """Gives each docked item the title and the line of text it was docked with."""

    number = 3
    statements = (
        "ALTER TABLE dock_items ADD COLUMN title TEXT NOT NULL DEFAULT ''",
        "ALTER TABLE dock_items ADD COLUMN text TEXT NOT NULL DEFAULT ''",
    )
