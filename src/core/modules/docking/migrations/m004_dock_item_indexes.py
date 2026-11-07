from core.base.database.migration import Migration


class DockItemIndexesMigration(Migration):
    """Indexes for the dock items of a type and of a target, which each process event asks for."""

    number = 4
    statements = ("CREATE INDEX dock_items_type ON dock_items (type, id)",
                  "CREATE INDEX dock_items_target ON dock_items (target_model, target_id)")
