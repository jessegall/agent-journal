import sqlite3
from contextlib import contextmanager
from dataclasses import asdict
from collections.abc import Callable, Sequence
from core.base.clock import Clock
from core.base.container import Container
from threading import RLock
from uuid import uuid4
from time import perf_counter

from core.base.database.database import Database
from core.base.database.hook_requests_table import HookRequestsTable
from core.base.journal_container import synced_database_container
from core.base.journal_home import JournalHome
from core.base.log_level import LogLevel
from core.base.log_source import LogSource
from core.base.system_log_writer import SystemLogWriter
from core.modules.developer.support.hook_request_log import HookRequestLog
from core.modules.drivers.models.enums.hook_answer import HookAnswer
from core.modules.developer.support.developer_settings import HOOK_REQUEST_LOG_SETTING, HOOK_REQUEST_LOG_SIZE_SETTING
from core.modules.settings.bindings.support.setting_values import SettingValues
from server.request_log_entry import RequestLogEntry
from server.viewer.read_attribution import ReadAttribution
from server.viewer.viewer_request_record import ViewerRequestRecord
from server.viewer.window_priorities import WindowPriorities
from server.request_log_settings import RequestLogSettings

SETTINGS_REFRESH_SECONDS = 5.0


def is_database_busy(error: sqlite3.Error) -> bool:
    return getattr(error, "sqlite_errorcode", 0) & 0xff in (sqlite3.SQLITE_BUSY, sqlite3.SQLITE_LOCKED)


class RequestLog:
    """Records requests without waiting for a database writer."""

    def __init__(self, home: JournalHome, clock: Clock) -> None:
        self.home = home
        self.system_log = SystemLogWriter(home, clock)
        self.priorities = WindowPriorities(home)
        self.epoch = str(uuid4())
        self.lock = RLock()
        self.container: Container | None = None
        self.configuration = RequestLogSettings()
        self.last_refreshed_at: float | None = None
        self.stored_rows = 0
        self.recording_ms = 0.0
        self.counts = {"attempted": 0, "recorded": 0, "dropped": 0, "disabled": 0, "http_requests": 0,
                       "receipt_attempted": 0, "receipt_recorded": 0, "receipt_dropped": 0, "receipt_disabled": 0}

    @contextmanager
    def connected(self):
        with self.lock:
            if self.container is None:
                connection = sqlite3.connect(self.home.database, timeout=0, autocommit=True, check_same_thread=False)
                connection.row_factory = sqlite3.Row
                database = Database(connection, str(self.home.database))
                try:
                    self.container = synced_database_container(self.home, database)
                except BaseException:
                    database.close()
                    raise
            yield self.container

    def close(self) -> None:
        with self.lock:
            if self.container is not None:
                self.container.get(Database).close()
                self.container = None

    def refresh(self, container: Container) -> None:
        settings = container.get(SettingValues).project
        with settings.keep_rows():
            enabled = settings.flag(HOOK_REQUEST_LOG_SETTING)
            configuration = RequestLogSettings(enabled, max(settings.number(HOOK_REQUEST_LOG_SIZE_SETTING), 1) if enabled else 0)
        stored_rows = container.get(HookRequestsTable).kept_row_count()
        with self.lock:
            self.configuration, self.stored_rows = configuration, stored_rows
            self.last_refreshed_at = perf_counter()
            if not configuration.enabled:
                self.close()

    def completed(self, container: Container, argv: list[str]) -> None:
        try:
            if argv[:1] == ["setting"] or self.last_refreshed_at is None or perf_counter() - self.last_refreshed_at >= SETTINGS_REFRESH_SECONDS:
                self.refresh(container)
        except sqlite3.Error as error:
            if not is_database_busy(error):
                self.system_log.write(LogLevel.WARNING, f"request log settings could not be refreshed: {error}", LogSource.SERVER)

    def status(self) -> dict[str, object]:
        with self.lock:
            if self.configuration.enabled:
                with self.connected() as container:
                    self.stored_rows = container.get(HookRequestsTable).kept_row_count()
            return {**self.counts, "epoch": self.epoch, "enabled": self.configuration.enabled, "retained": self.stored_rows, "retention_limit": self.configuration.limit,
                    "recording_ms": self.recording_ms}

    def record_viewer(self, record: ViewerRequestRecord) -> None:
        self.record_viewers([record])

    def record_viewers(self, records: Sequence[ViewerRequestRecord]) -> None:
        self.save_many([self.viewer_entry(record) for record in records])

    def viewer_entry(self, record: ViewerRequestRecord) -> RequestLogEntry:
        request, http = record.request, record.http
        attribution = {**asdict(request.attribution), "schema": 1, "request_id": http.request_id,
                       "batch_id": http.batch_id, "child_index": record.child_index, "person_id": http.person_id,
                       "window": request.window, "environment": request.environment, "received_at": http.received_at,
                       "logical_command": " ".join(request.line[:2]),
                       "http_duration_ms": http.duration_ms if record.child_index == 0 else None,
                       "http_duration_scope": "execution and queue, before log writes",
                       "command_duration_ms": record.duration_ms, "payload_bytes": http.payload_bytes if record.child_index == 0 else None,
                       "database_points": record.points.total if record.points is not None else None,
                       "database_rows": record.points.rows if record.points is not None else None,
                       "database_bytes": record.points.bytes if record.points is not None else None}
        if not attribution["command_id"]:
            attribution["command_id"] = f"{http.request_id}:{record.child_index}"
        body = {"event": " ".join(request.line), "attribution": attribution}
        return RequestLogEntry(request.line, "viewer", record.duration_ms, record.queued_ms, record.code, body)

    def complete_reads(self, person_id: int, receipts: tuple[ReadAttribution, ...]) -> None:
        started_at = perf_counter()
        with self.lock:
            self.counts["receipt_attempted"] += len(receipts)
            if not self.configuration.enabled:
                self.counts["receipt_disabled"] += len(receipts)
                return
        try:
            with self.connected() as container:
                with container.get(Database).transaction():
                    recorded = sum(container.get(HookRequestsTable).complete_viewer_read(
                        person_id, receipt.client_id, receipt.command_id, receipt.joined_callers) > 0 for receipt in receipts)
            with self.lock:
                self.counts["receipt_recorded"] += recorded
                self.counts["receipt_dropped"] += len(receipts) - recorded
        except sqlite3.Error as error:
            with self.lock:
                self.counts["receipt_dropped"] += len(receipts)
            if not is_database_busy(error):
                self.system_log.write(LogLevel.WARNING, f"read receipt recording failed: {error}", LogSource.SERVER)
        finally:
            with self.lock:
                self.recording_ms += (perf_counter() - started_at) * 1000

    def record(self, line: list[str], role: str, duration_ms: float, queued_ms: float, code: int) -> None:
        self.save(RequestLogEntry(line, role, duration_ms, queued_ms, code, {"event": " ".join(line)}))

    def record_hook(self, record: Callable[[], bool]) -> None:
        started_at = perf_counter()
        with self.lock:
            self.counts["attempted"] += 1
        try:
            recorded = record()
            with self.lock:
                self.counts["recorded" if recorded else "disabled"] += 1
        except sqlite3.Error as error:
            with self.lock:
                self.counts["dropped"] += 1
            if not is_database_busy(error):
                self.system_log.write(LogLevel.WARNING, f"request recording failed: {error}", LogSource.SERVER)
        finally:
            with self.lock:
                self.recording_ms += (perf_counter() - started_at) * 1000

    def save(self, entry: RequestLogEntry) -> None:
        self.save_many([entry])

    def save_many(self, entries: Sequence[RequestLogEntry]) -> None:
        entries = [entry for entry in entries if not self.priorities.is_unqueued(entry.line)]
        if not entries:
            return
        started_at = perf_counter()
        with self.lock:
            configuration = self.configuration
            self.counts["attempted"] += len(entries)
            if any(isinstance(entry.body, dict) and "attribution" in entry.body and entry.body["attribution"]["child_index"] == 0 for entry in entries):
                self.counts["http_requests"] += 1
            if not configuration.enabled:
                self.counts["disabled"] += len(entries)
                return
        try:
            with self.connected() as container:
                log = container.get(HookRequestLog)
                payloads = [log.payload("", {}, entry.body, entry.duration_ms, HookAnswer.ALLOWED if entry.code == 0 else HookAnswer.REFUSED, entry.queued_ms, entry.role, "") for entry in entries]
                container.get(HookRequestsTable).record_many(payloads, configuration.limit)
                self.stored_rows = container.get(HookRequestsTable).kept_row_count()
            with self.lock:
                self.counts["recorded"] += len(entries)
        except sqlite3.Error as error:
            with self.lock:
                self.counts["dropped"] += len(entries)
            if not is_database_busy(error):
                self.system_log.write(LogLevel.WARNING, f"request recording failed: {error}", LogSource.SERVER)
        finally:
            with self.lock:
                self.recording_ms += (perf_counter() - started_at) * 1000
