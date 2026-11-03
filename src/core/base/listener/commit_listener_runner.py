from core.base.change.event_log import EventLog
from core.base.change.logged_event import LoggedEvent
from core.base.container import Container
from core.base.error_log import ErrorLog
from core.base.exception_sink import ExceptionSink
from core.base.listener.commit_listener import CommitListener
from core.base.database.listener_cursor_table import ListenerCursorTable
from core.base.registry.listener_entry import ListenerEntry
from core.base.registry.listener_timing import ListenerTiming
from core.base.registry.registry import Registry
from core.base.scope.scopes import Scopes
from core.base.listener.commit_listener_error import CommitListenerError
from core.base.database.performance_costs import PerformanceCosts
from core.base.performance.performance_state import PerformanceState


FAILURE_LIMIT_ATTEMPTS = 3
CHAIN_LIMIT_ROUNDS = 50
COSTLY_LISTENER_POINTS = 500


class CommitListenerRunner:
    """Runs the commit listeners on every logged event they have not handled yet, in order, so work a stopped
    run left undone is done by the next. It claims each event it listens to before handling it, so a second
    runner never handles the same one, and moves over the events it does not hear in one write; an event that
    fails is given back to be tried again, and one that fails three times is skipped. Listeners a person waits
    on run first and again after each other listener that handled events, and the server runs them on a thread
    of their own; a costly one is noted with its points."""

    def __init__(self, registry: Registry, log: EventLog, container: Container, errors: ErrorLog, cursors: ListenerCursorTable,
                 exceptions: ExceptionSink, scopes: Scopes) -> None:
        self.registry, self.log, self.container, self.errors, self.cursors, self.exceptions, self.scopes = registry, log, container, errors, cursors, exceptions, scopes

    def run(self) -> None:
        try:
            self.exceptions.flush()
        except Exception as failure:
            self.errors.noted(f"waiting exceptions could not be recorded: {type(failure).__name__}: {failure}")
        entries = self.commit_entries()
        self.run_rounds(entries, [entry for entry in entries if self.is_urgent(entry)])

    def run_urgent(self) -> None:
        urgent_entries = [entry for entry in self.commit_entries() if self.is_urgent(entry)]
        self.run_rounds(urgent_entries, [])

    def run_ordinary(self) -> None:
        try:
            self.exceptions.flush()
        except Exception as failure:
            self.errors.noted(f"waiting exceptions could not be recorded: {type(failure).__name__}: {failure}")
        self.run_rounds([entry for entry in self.commit_entries() if not self.is_urgent(entry)], [])

    def commit_entries(self) -> list[ListenerEntry]:
        return sorted((entry for entry in self.registry.listeners if entry.timing is ListenerTiming.COMMIT), key=self.run_order)

    def is_urgent(self, entry: ListenerEntry) -> bool:
        return self.run_order(entry) < 0

    def run_rounds(self, entries: list[ListenerEntry], urgent_entries: list[ListenerEntry]) -> None:
        for _ in range(CHAIN_LIMIT_ROUNDS):
            state = self.container.get(PerformanceState)
            boot_event = state.boot_event()
            if boot_event and not self.cursors.has_pending_events(boot_event):
                state.finish_start()
            if not self.cursors.has_unhandled_events():
                return
            progress = [self.run_entry(entry, urgent_entries) for entry in entries]
            if not any(progress):
                return

    def run_entry(self, entry: ListenerEntry, urgent_entries: list[ListenerEntry]) -> bool:
        handled = self.run_listener(entry)
        if handled:
            for listener in urgent_entries:
                self.run_listener(listener)
        return handled

    @staticmethod
    def run_order(entry: ListenerEntry) -> int:
        listener_class = entry.path.loaded()
        return listener_class.run_order if issubclass(listener_class, CommitListener) else 0

    def run_listener(self, entry: ListenerEntry) -> bool:
        position = self.cursors.position(entry.name)
        events = self.log.events_past(position)
        progress = False
        for event in events:
            if not entry.event.matches(event.event):
                continue
            if not self.cursors.claimed(entry.name, position, event.id):
                return progress
            if not self.handle_event(entry, event):
                self.cursors.claimed(entry.name, event.id, position)
                return progress
            position, progress = event.id, True
        if events and events[-1].id != position:
            return self.cursors.claimed(entry.name, position, events[-1].id) or progress
        return progress

    def handle_event(self, entry: ListenerEntry, event: LoggedEvent) -> bool:
        listener_class = entry.path.loaded()
        if not issubclass(listener_class, CommitListener):
            raise CommitListenerError(f"{entry.path.text} is no commit listener")
        tools = self.container.get(PerformanceCosts)
        start_points = tools.begin()
        try:
            with self.scopes.event_scope(listener_class.disabled_scopes, event):
                self.container.get(listener_class).handle(event)
            cost = tools.cost(start_points)
            if cost is not None and cost.total >= COSTLY_LISTENER_POINTS:
                self.errors.noted(f"listener {entry.name} cost {cost.line()} on event {event.id} {event.event}")
        except Exception as error:
            failures = self.cursors.failure_count(entry.name, event.id)
            self.errors.reported(["listener", entry.name, "event", str(event.id)], error, event.environment_id)
            return failures >= FAILURE_LIMIT_ATTEMPTS
        return True
