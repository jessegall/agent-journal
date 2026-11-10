from engine.database.migration import Migration


class WorkerMarkCursorMigration(Migration):
    """Keeps pending events when the mark listeners are separated."""

    number = 41
    statements = [
        "INSERT OR IGNORE INTO listener_cursors (listener, event_id) "
        "SELECT 'workers.split-mark', event_id FROM listener_cursors WHERE listener = 'workers.route-mark'",
        "INSERT OR IGNORE INTO listener_cursors (listener, event_id) "
        "SELECT 'workers.task-tag-route-mark', event_id FROM listener_cursors WHERE listener = 'workers.task-route-mark'",
    ]
