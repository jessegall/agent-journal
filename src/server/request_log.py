import logging
import sqlite3
from contextlib import contextmanager
from dataclasses import asdict, dataclass
from threading import RLock
from uuid import uuid4
from time import perf_counter

from core.base.database.database import Database
from core.base.database.hook_requests_table import HookRequestsTable
from core.base.journal_container import synced_database_container
from core.base.journal_home import JournalHome
from core.modules.developer.support.hook_request_log import HookRequestLog
from core.modules.drivers.models.enums.hook_answer import HookAnswer
from core.modules.developer.support.developer_settings import HOOK_REQUEST_LOG_SETTING, HOOK_REQUEST_LOG_SIZE_SETTING
from core.modules.settings.bindings.support.setting_values import SettingValues
from server.request_log_entry import RequestLogEntry
from server.viewer.read_attribution import ReadAttribution
from server.viewer.viewer_request_record import ViewerRequestRecord


class RequestLog:
    """Records requests without waiting for a database writer."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home
        self.epoch = str(uuid4())
        self.lock = RLock()
        self.recording_ms = 0.0
        self.counts = {"attempted": 0, "recorded": 0, "dropped": 0, "disabled": 0, "http_requests": 0,
                       "receipt_attempted": 0, "receipt_recorded": 0, "receipt_dropped": 0, "receipt_disabled": 0}

    @contextmanager
    def connected(self):
        connection = sqlite3.connect(self.home.database, timeout=0, autocommit=True)
        connection.row_factory = sqlite3.Row
        database = Database(connection, str(self.home.database))
        try:
            yield synced_database_container(self.home, database)
        finally:
            database.close()

    def status(self) -> dict[str, object]:
        with self.connected() as container:
            settings = container.get(SettingValues).project
            stored_count = container.get(HookRequestsTable).kept_row_count()
            enabled = settings.flag(HOOK_REQUEST_LOG_SETTING)
            limit = settings.number(HOOK_REQUEST_LOG_SIZE_SETTING)
        with self.lock:
            return {**self.counts, "epoch": self.epoch, "enabled": enabled, "retained": stored_count, "retention_limit": limit,
                    "recording_ms": self.recording_ms}

    def record_viewer(self, record: ViewerRequestRecord) -> None:
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
        self.save(RequestLogEntry(request.line, "viewer", record.duration_ms, record.queued_ms, record.code, body))

    def complete_reads(self, person_id: int, receipts: tuple[ReadAttribution, ...]) -> None:
        started_at = perf_counter()
        with self.lock:
            self.counts["receipt_attempted"] += len(receipts)
        try:
            with self.connected() as container:
                if not container.get(SettingValues).project.flag(HOOK_REQUEST_LOG_SETTING):
                    with self.lock:
                        self.counts["receipt_disabled"] += len(receipts)
                    return
                with container.get(Database).transaction():
                    recorded = sum(container.get(HookRequestsTable).complete_viewer_read(
                        person_id, receipt.client_id, receipt.command_id, receipt.joined_callers) > 0 for receipt in receipts)
            with self.lock:
                self.counts["receipt_recorded"] += recorded
                self.counts["receipt_dropped"] += len(receipts) - recorded
        except sqlite3.Error as error:
            with self.lock:
                self.counts["receipt_dropped"] += len(receipts)
            logging.getLogger(__name__).warning("read receipt recording failed: %s", error)
        finally:
            with self.lock:
                self.recording_ms += (perf_counter() - started_at) * 1000

    def record(self, line: list[str], role: str, duration_ms: float, queued_ms: float, code: int) -> None:
        self.save(RequestLogEntry(line, role, duration_ms, queued_ms, code, {"event": " ".join(line)}))

    def save(self, entry: RequestLogEntry) -> None:
        if entry.role == "viewer" and entry.line[:2] in (["developer", "hook-requests"], ["developer", "request-queue"]):
            return
        started_at = perf_counter()
        with self.lock:
            self.counts["attempted"] += 1
            if isinstance(entry.body, dict) and "attribution" in entry.body and entry.body["attribution"]["child_index"] == 0:
                self.counts["http_requests"] += 1
        try:
            with self.connected() as container:
                outcome = HookAnswer.ALLOWED if entry.code == 0 else HookAnswer.REFUSED
                recorded = container.get(HookRequestLog).record("", {}, entry.body, entry.duration_ms, outcome, entry.queued_ms, entry.role)
            with self.lock:
                self.counts["recorded" if recorded else "disabled"] += 1
        except sqlite3.Error as error:
            with self.lock:
                self.counts["dropped"] += 1
            logging.getLogger(__name__).warning("request recording failed: %s", error)
        finally:
            with self.lock:
                self.recording_ms += (perf_counter() - started_at) * 1000
