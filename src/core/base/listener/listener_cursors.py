from core.base.database.database import Database
from core.base.database.statement import Statement

START_CURSOR = Statement("INSERT OR IGNORE INTO listener_cursors (listener, event_id) VALUES (?, (SELECT coalesce(max(id), 0) FROM events))")


class ListenerCursors:
    """Where each commit listener stands in the event log; a new listener starts at the newest event."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def start(self, listener: str) -> None:
        self.database.update(Statement(START_CURSOR.sql, (listener,)))
