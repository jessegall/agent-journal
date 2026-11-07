from core.base.database.migration import Migration


class DockItemStateIndexMigration(Migration):
    """Indexes dock items in each state."""

    number = 9
    statements = ["CREATE INDEX dock_items_state ON dock_items (state, id)"]
