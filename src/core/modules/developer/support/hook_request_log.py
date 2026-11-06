import json
from collections.abc import Mapping
from datetime import timedelta

from core.base.clock import Clock
from core.base.database.hook_requests_table import HookRequestsTable
from core.base.query.queries import Queries
from core.base.query.conditions.among import Among
from core.modules.developer.support.developer_settings import HOOK_REQUEST_LOG_SETTING, HOOK_REQUEST_LOG_SIZE_SETTING
from core.modules.developer.models.hook_request import HookRequest
from core.modules.drivers.models.enums.hook_answer import HookAnswer
from core.modules.settings.bindings.support.setting_values import SettingValues

class HookRequestLog:
    """Keeps the configured number of completed requests and reads their display view."""

    def __init__(self, table: HookRequestsTable, queries: Queries, settings: SettingValues, clock: Clock) -> None:
        self.table, self.queries, self.settings, self.clock = table, queries, settings, clock

    def read(self) -> list[HookRequest]:
        return list(self.queries.query(HookRequest).descending("id").all_rows())

    def filter_options(self) -> list[tuple[str, str]]:
        return self.table.filter_options()

    def filtered(self, categories: list[str], families: list[str], senders: list[str]) -> list[HookRequest]:
        query = self.queries.query(HookRequest).descending("id")
        for column, values in (("kind", categories), ("family", families), ("sender", senders)):
            if values:
                query = query.matching(Among(column, values))
        if not families:
            query = query.matching(Among("family", ["process bookkeeping"], negated=True))
        return list(query.all_rows())

    def record(self, program: str, headers: Mapping[str, str], body: object, duration_ms: float, outcome: HookAnswer, queued_ms: float = 0, role: str = "main", agent: str = "") -> bool:
        if not self.settings.project.flag(HOOK_REQUEST_LOG_SETTING):
            return False
        received_at = (self.clock.timestamp().value - timedelta(milliseconds=duration_ms)).isoformat(timespec="microseconds")
        payload = json.dumps({"received_at": received_at, "program": program,
                              "headers": dict(headers), "body": body, "duration_ms": duration_ms, "queued_ms": queued_ms, "role": role, "agent": agent, "outcome": outcome.value})
        self.table.record(payload, max(self.settings.project.number(HOOK_REQUEST_LOG_SIZE_SETTING), 1))
        return True
