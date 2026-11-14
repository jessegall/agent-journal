from time import perf_counter
from functools import cached_property

from engine.command.errors.server_stopping_error import ServerStoppingError
from engine.event.event_log import EventLog
from engine.event.changed import Changed
from engine.event.event_type import EventType
from engine.event.logged_event import LoggedEvent
from engine.container.container import Container
from engine.container.round_state import RoundState
from engine.log.error_log import ErrorLog
from engine.enums.log_level import LogLevel
from engine.log.system_log_writer import SystemLogWriter
from engine.log.exception_sink import ExceptionSink
from engine.listener.round_yield import RoundYield
from engine.listener.commit.commit_listener import is_commit_listener_class
from engine.listener.commit.listener_set import ListenerSet
from engine.database.listener_cursor_table import ListenerCursorTable
from engine.registry.listener_entry import ListenerEntry
from engine.enums.listener_timing import ListenerTiming
from engine.registry.registry import Registry
from engine.scope.scopes import Scopes
from engine.listener.errors.commit_listener_error import CommitListenerError
from engine.listener.event_builder import EventBuilder
from engine.database.performance_costs import PerformanceCosts
from engine.performance.performance_state import PerformanceState
from engine.errors.refusal import Refusal
from engine.listener.errors.listener_time_limit_error import ListenerTimeLimitError
from engine.setting.setting_values import SettingValues
from engine.request.request_values import RequestValues


FAILURE_LIMIT_ATTEMPTS = 3
CHAIN_LIMIT_ROUNDS = 50
COSTLY_LISTENER_POINTS = 500
SLOW_LISTENER_SECONDS = 0.5
PROGRAM_STOP_RUN_ORDER = 500
PLUGIN_RUN_ORDER = 1000
LISTENER_TIME_LIMIT_SETTING = "journal.core.developer.tools.listener-time-limit"
LISTENER_TIME_LIMIT_ON_SETTING = "journal.core.developer.tools.listener-time-limit-on"


class CommitListenerRunner(RoundState):
    """Runs commit listeners with at most once delivery across a server stop; reported failures are retried."""

    def __init__(self, registry: Registry, log: EventLog, container: Container, errors: ErrorLog, cursors: ListenerCursorTable,
                 exceptions: ExceptionSink, scopes: Scopes, system_log: SystemLogWriter, turns: RoundYield) -> None:
        self.system_log, self.turns = system_log, turns
        self.registry, self.log, self.container, self.errors, self.cursors, self.exceptions, self.scopes = registry, log, container, errors, cursors, exceptions, scopes
        self.positions: dict[str, int] = {}
        self.positions_stale = False
        self.held_listeners: set[str] = set()
        self.heard_names: dict[tuple[str, str], bool] = {}

    def reset(self) -> None:
        self.positions = {}
        self.positions_stale = False

    def run(self) -> None:
        self.flush_exceptions()
        entries = self.commit_entries()
        self.run_rounds(entries, [entry for entry in entries if self.is_urgent(entry)])

    def run_urgent(self) -> None:
        urgent_entries = [entry for entry in self.commit_entries() if self.is_urgent(entry)]
        self.run_rounds(urgent_entries, [])

    def run_ordinary(self) -> None:
        self.flush_exceptions()
        self.run_rounds([entry for entry in self.commit_entries() if not self.is_urgent(entry) and not self.has_slow_round(entry)], [])

    def run_program_stops(self) -> None:
        self.run_rounds([entry for entry in self.commit_entries() if self.has_slow_round(entry) and not self.is_plugin(entry)], [])

    def run_plugin_deliveries(self) -> None:
        self.run_rounds([entry for entry in self.commit_entries() if self.is_plugin(entry)], [])

    def flush_exceptions(self) -> None:
        try:
            self.exceptions.flush()
        except Exception as failure:
            self.system_log.write(LogLevel.ERROR, f"waiting exceptions could not be recorded: {type(failure).__name__}: {failure}")

    def commit_entries(self) -> list[ListenerEntry]:
        return list(self.listener_set.entries)

    # built once for the runner's container: no round builds a listener
    @cached_property
    def listener_set(self) -> ListenerSet:
        return ListenerSet(ListenerSet.thread_name(self.container), self.registry, self.container, sorted((entry for entry in self.registry.listeners if entry.timing is ListenerTiming.COMMIT), key=self.run_order))

    # the next round builds the listeners again, from the container as it is then
    def close(self) -> None:
        if "listener_set" in self.__dict__:
            self.listener_set.close()
            del self.__dict__["listener_set"]

    def is_urgent(self, entry: ListenerEntry) -> bool:
        return self.run_order(entry) < 0

    def is_plugin(self, entry: ListenerEntry) -> bool:
        return self.run_order(entry) >= PLUGIN_RUN_ORDER

    def has_slow_round(self, entry: ListenerEntry) -> bool:
        return self.run_order(entry) >= PROGRAM_STOP_RUN_ORDER

    def run_rounds(self, entries: list[ListenerEntry], urgent_entries: list[ListenerEntry]) -> None:
        if self.positions_stale:
            self.positions, self.positions_stale = {}, False
        state = self.container.get(PerformanceState)
        boot_event = state.boot_event()
        for _ in range(CHAIN_LIMIT_ROUNDS):
            if boot_event and not self.cursors.has_pending_events(boot_event, [entry.name for entry in self.commit_entries() if self.has_slow_round(entry)]):
                state.finish_start()
            if not self.cursors.has_unhandled_events():
                return
            if not self.run_round(entries, urgent_entries):
                return

    def run_round(self, entries: list[ListenerEntry], urgent_entries: list[ListenerEntry]) -> bool:
        positions = self.known_positions(entries)
        entries = [entry for entry in entries if entry.name in positions and entry.name not in self.held_listeners]
        events = self.log.events_after(min(positions[entry.name] for entry in entries)) if entries else []
        if not events:
            return False
        # a lagging cursor asks each distinct event name once, not each event
        newest_ids: dict[str, int] = {}
        for event in events:
            newest_ids[event.event] = event.id
        due_entries = [entry for entry in entries if any(newest_id > positions[entry.name] and self.hears(entry, name) for name, newest_id in newest_ids.items())]
        due_names = {entry.name for entry in due_entries}
        moved_count = self.cursors.advance_all([entry.name for entry in entries if entry.name not in due_names], events[-1].id)
        positions.update({entry.name: events[-1].id for entry in entries if entry.name not in due_names})
        progress = [self.run_entry(entry, urgent_entries, events) for entry in due_entries]
        return bool(moved_count) or any(progress)

    def hears(self, entry: ListenerEntry, event_name: str) -> bool:
        key = (entry.name, event_name)
        if key not in self.heard_names:
            self.heard_names[key] = entry.event.matches(event_name)
        return self.heard_names[key]

    def known_positions(self, entries: list[ListenerEntry]) -> dict[str, int]:
        if any(entry.name not in self.positions for entry in entries):
            self.positions = self.cursors.positions()
        return self.positions

    def run_entry(self, entry: ListenerEntry, urgent_entries: list[ListenerEntry], events: list[LoggedEvent]) -> bool:
        handled = self.run_listener(entry, events)
        if handled and urgent_entries:
            self.run_urgent_events(urgent_entries, events)
        return handled

    def run_urgent_events(self, urgent_entries: list[ListenerEntry], events: list[LoggedEvent]) -> None:
        if self.log.newest_id() == events[-1].id:
            return
        newer_events = self.log.events_after(events[-1].id)
        for listener in urgent_entries:
            self.run_listener(listener, newer_events)

    @staticmethod
    def run_order(entry: ListenerEntry) -> int:
        listener_class = entry.path.loaded()
        return listener_class.run_order if is_commit_listener_class(listener_class) else 0

    def run_listener(self, entry: ListenerEntry, round_events: list[LoggedEvent]) -> bool:
        position = self.positions[entry.name]
        events = [event for event in round_events if event.id > position]
        progress = False
        matching = [event for event in events if self.hears(entry, event.event)]
        if not self.is_prepared(entry, matching, position):
            return progress
        for event in matching:
            if not self.cursors.claimed(entry.name, position, event.id):
                self.positions_stale = True
                return progress
            with self.turns.event_turn(event.event):
                handled = self.handle_event(entry, event)
            if not handled:
                self.cursors.claimed(entry.name, event.id, position)
                return progress
            position, progress = event.id, True
            self.positions[entry.name] = position
            if entry.name in self.held_listeners:
                return progress
        if events and events[-1].id != position:
            advanced = self.cursors.claimed(entry.name, position, events[-1].id)
            if advanced:
                self.positions[entry.name] = events[-1].id
            return advanced or progress
        return progress

    # a prepare that raises holds back this listener alone, and past the failure limit its first event is skipped
    def is_prepared(self, entry: ListenerEntry, events: list[LoggedEvent], position: int) -> bool:
        try:
            self.prepare_rows(entry, events)
        except ServerStoppingError:
            return False
        except Exception as error:
            first = events[0]
            failures = self.cursors.failure_count(entry.name, first.id)
            self.errors.reported(["listener", entry.name, "prepare", "event", str(first.id)], error, first.environment_id)
            if failures >= FAILURE_LIMIT_ATTEMPTS and self.cursors.claimed(entry.name, position, first.id):
                self.positions[entry.name] = first.id
            return False
        return True

    def prepare_rows(self, entry: ListenerEntry, events: list[LoggedEvent]) -> None:
        listener_class = entry.path.loaded()
        if not is_commit_listener_class(listener_class):
            return
        groups: dict[tuple[EventType, int | None, int | None], list[LoggedEvent]] = {}
        for event in events:
            event_type = listener_class.event_type(event.event)
            if event_type.model is None or not issubclass(event_type.event_class, Changed):
                continue
            with self.scopes.event_scope(listener_class.disabled_scopes, event):
                groups.setdefault((event_type, self.scopes.actor_id, self.scopes.environment_id), []).append(event)
        for (event_type, _, _), grouped in groups.items():
            with self.scopes.event_scope(listener_class.disabled_scopes, grouped[0]):
                self.container.get(EventBuilder).prepare(event_type, grouped)
                self.listener_set.instance(entry).prepare(grouped)

    def handle_event(self, entry: ListenerEntry, event: LoggedEvent) -> bool:
        listener_class = entry.path.loaded()
        if not is_commit_listener_class(listener_class):
            raise CommitListenerError(f"{entry.path.text} is no commit listener")
        tools = self.container.get(PerformanceCosts)
        start_points = tools.begin()
        started_at = perf_counter()
        try:
            # one event is one request, so the reads a listener repeats are loaded once
            with self.container.get(RequestValues).opened(), self.scopes.event_scope(listener_class.disabled_scopes, event):
                built_event = self.container.get(EventBuilder).built(listener_class.event_type(event.event), event)
                if built_event is not None:
                    self.listener_set.instance(entry).handle(built_event, event)
            elapsed = perf_counter() - started_at
            self.hold_when_over_time_limit(entry, event, elapsed)
            if elapsed >= SLOW_LISTENER_SECONDS:
                self.system_log.write(LogLevel.INFORMATION, f"listener {entry.name} took {elapsed * 1000:.0f} ms on event {event.id} {event.event}")
            cost = tools.cost(start_points)
            if cost is not None and cost.total >= COSTLY_LISTENER_POINTS:
                self.system_log.write(LogLevel.INFORMATION, f"listener {entry.name} cost {cost.line()} on event {event.id} {event.event}")
        except Refusal as refusal:
            self.system_log.write(LogLevel.WARNING, f"listener {entry.name} refused event {event.id}: {refusal}")
            return True
        except ServerStoppingError:
            return False
        except Exception as error:
            failures = self.cursors.failure_count(entry.name, event.id)
            self.errors.reported(["listener", entry.name, "event", str(event.id)], error, event.environment_id)
            return failures >= FAILURE_LIMIT_ATTEMPTS
        return True

    # a developer setting, off by default: a listener of the ordinary rounds over the limit runs no more events until the server restarts, and its
    # error reaches the main agent at once; its cursor stays, so the held events run after the restart
    def hold_when_over_time_limit(self, entry: ListenerEntry, event: LoggedEvent, elapsed: float) -> None:
        if self.has_slow_round(entry):
            return
        settings = self.container.get(SettingValues)
        if not settings.flag(LISTENER_TIME_LIMIT_ON_SETTING):
            return
        limit_ms = settings.number(LISTENER_TIME_LIMIT_SETTING)
        if elapsed * 1000 <= limit_ms:
            return
        self.held_listeners.add(entry.name)
        error = ListenerTimeLimitError(entry.name, round(elapsed * 1000), limit_ms, event.id, event.event)
        self.errors.reported(["listener", entry.name, "event", str(event.id)], error, event.environment_id)
