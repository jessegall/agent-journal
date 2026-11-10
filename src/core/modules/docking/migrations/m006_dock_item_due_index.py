from engine.database.migration import Migration


class DockItemDueIndexMigration(Migration):
    """Indexes the scheduled departures of docked items that are not kept."""

    number = 6
    statements = ("CREATE INDEX dock_items_due ON dock_items (leaves_at, id)"
                  " WHERE state = 'docked' AND kept = 0 AND leaves_at IS NOT NULL",)
