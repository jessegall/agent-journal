from core.base.change.event_log import EventLog
from core.base.change.logged_event import LoggedEvent
from core.base.container import Container
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.error_log import ErrorLog
from core.base.listener.commit_listener import CommitListener
from core.base.listener.listener_cursors import ListenerCursors
from core.base.module.listener_entry import ListenerEntry, ListenerTiming
from core.base.module.registry import Registry

FAILURE_LIMIT_ATTEMPTS = 3
CHAIN_LIMIT_ROUNDS = 50
CURSOR_GAP = Statement("SELECT (SELECT coalesce(min(event_id), 0) FROM listener_cursors) < (SELECT coalesce(max(id), 0) FROM events)")
CURSOR = Statement("SELECT event_id FROM listener_cursors WHERE listener = ?")
MOVE_CURSOR = Statement("UPDATE listener_cursors SET event_id = ? WHERE listener = ?")
COUNT_FAILURE = Statement("INSERT INTO listener_skips (listener, event_id, failures) VALUES (?, ?, 1)"
                          " ON CONFLICT (listener, event_id) DO UPDATE SET failures = failures + 1 RETURNING failures")


class CommitListenerError(Exception):
    """Raised when a registered commit listener's path leads to a class that is not a commit listener."""


class CommitListenerRunner:
    """Runs the commit listeners on every logged event they have not handled yet, in order, so work a stopped run
    left undone is done by the next; an event that fails a listener three times is skipped for it."""

    def __init__(self, database: Database, registry: Registry, log: EventLog, container: Container, errors: ErrorLog, cursors: ListenerCursors) -> None:
        self.database, self.registry, self.log, self.container, self.errors, self.cursors = database, registry, log, container, errors, cursors

    def run(self) -> None:
        entries = tuple(entry for entry in self.registry.listeners if entry.timing is ListenerTiming.COMMIT)
        for entry in entries:
            self.cursors.start(entry.name)
        for _ in range(CHAIN_LIMIT_ROUNDS):
            if not self.database.rows(CURSOR_GAP)[0][0]:
                return
            progress = [self.run_listener(entry) for entry in entries]
            if not any(progress):
                return

    def run_listener(self, entry: ListenerEntry) -> bool:
        cursor = self.database.rows(Statement(CURSOR.sql, (entry.name,)))[0][0]
        progress = False
        for event in self.log.events_past(cursor):
            if entry.event.matches(event.event) and not self.handle_event(entry, event):
                return progress
            self.database.update(Statement(MOVE_CURSOR.sql, (event.id, entry.name)))
            progress = True
        return progress

    def handle_event(self, entry: ListenerEntry, event: LoggedEvent) -> bool:
        listener_class = entry.path.loaded()
        if not issubclass(listener_class, CommitListener):
            raise CommitListenerError(f"{entry.path.text} is no commit listener")
        try:
            self.container.get(listener_class).handle(event)
        except Exception as error:
            failures = self.database.rows(Statement(COUNT_FAILURE.sql, (entry.name, event.id)))[0][0]
            self.errors.reported(["listener", entry.name, "event", str(event.id)], error)
            return failures >= FAILURE_LIMIT_ATTEMPTS
        return True
