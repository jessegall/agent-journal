import json
from collections.abc import Mapping
from datetime import timedelta

from core.base.clock import Clock
from core.base.database.hook_requests_table import HookRequestsTable
from core.base.query.queries import Queries
from core.modules.developer.support.developer_settings import HOOK_REQUEST_LOG_SETTING, HOOK_REQUEST_LOG_SIZE_SETTING
from core.modules.developer.models.hook_request import HookRequest
from core.modules.drivers.models.enums.hook_answer import HookAnswer
from core.modules.settings.bindings.support.setting_values import SettingValues

class HookRequestLog:
    """Keeps the configured number of completed requests and reads their display view."""

    def __init__(self, table: HookRequestsTable, queries: Queries, settings: SettingValues, clock: Clock) -> None:
        self.table, self.queries, self.settings, self.clock = table, queries, settings, clock

    def read(self) -> list[HookRequest]:
        return list(self.queries.query(HookRequest).ordered("-id").all_rows())

    def record(self, program: str, headers: Mapping[str, str], body: object, duration_ms: float, outcome: HookAnswer) -> None:
        if not self.settings.flag(HOOK_REQUEST_LOG_SETTING, None):
            return
        received_at = (self.clock.timestamp().value - timedelta(milliseconds=duration_ms)).isoformat(timespec="microseconds")
        payload = json.dumps({"received_at": received_at, "program": program,
                              "headers": dict(headers), "body": body, "duration_ms": duration_ms, "outcome": outcome.value})
        self.table.record(payload, max(self.settings.number(HOOK_REQUEST_LOG_SIZE_SETTING, None), 1))
