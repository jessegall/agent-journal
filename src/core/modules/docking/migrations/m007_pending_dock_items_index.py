from engine.database.migration import Migration


class PendingDockItemsIndexMigration(Migration):
    number = 7
    statements = ["CREATE INDEX dock_items_pending_idx ON dock_items(version, updated_at) WHERE state = 'docked' AND kept = 0 AND leaves_at IS NULL"]
