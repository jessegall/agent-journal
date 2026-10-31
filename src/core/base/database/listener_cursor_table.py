from core.base.database.database import Database
from core.base.database.statement import Statement

START = Statement("INSERT OR IGNORE INTO listener_cursors (listener, event_id) VALUES (?, (SELECT coalesce(max(id), 0) FROM events))")
POSITION = Statement("SELECT event_id FROM listener_cursors WHERE listener = ?")
CLAIM = Statement("UPDATE listener_cursors SET event_id = ? WHERE listener = ? AND event_id = ?")
UNHANDLED_EVENTS = Statement("SELECT (SELECT coalesce(min(event_id), 0) FROM listener_cursors) < (SELECT coalesce(max(id), 0) FROM events)")
FAILURE_COUNT = Statement("INSERT INTO listener_skips (listener, event_id, failures) VALUES (?, ?, 1)"
                          " ON CONFLICT (listener, event_id) DO UPDATE SET failures = failures + 1 RETURNING failures")
CURSOR_REMOVAL = Statement("DELETE FROM listener_cursors WHERE listener = ?")
SKIP_REMOVAL = Statement("DELETE FROM listener_skips WHERE listener = ?")


class ListenerCursorTable:
    """Where each commit listener stands in the event log, and how often an event has failed it; a new
    listener starts at the newest event, and a runner moves a cursor only from the position it read, so
    two runners never take the same event."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def start(self, listener: str) -> None:
        self.database.update(Statement(START.sql, [listener]))

    def position(self, listener: str) -> int:
        return self.database.rows(Statement(POSITION.sql, [listener]))[0][0]

    def claimed(self, listener: str, position: int, event_id: int) -> bool:
        return self.database.update(Statement(CLAIM.sql, (event_id, listener, position))) == 1

    def has_unhandled_events(self) -> bool:
        return bool(self.database.rows(UNHANDLED_EVENTS)[0][0])

    def failure_count(self, listener: str, event_id: int) -> int:
        return self.database.rows(Statement(FAILURE_COUNT.sql, (listener, event_id)))[0][0]

    def remove(self, listener: str) -> None:
        self.database.update(Statement(CURSOR_REMOVAL.sql, [listener]))
        self.database.update(Statement(SKIP_REMOVAL.sql, [listener]))
