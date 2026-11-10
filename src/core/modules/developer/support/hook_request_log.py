import json
from collections.abc import Mapping
from datetime import timedelta

from engine.time.clock import Clock
from core.base.database.hook_requests_table import HookRequestsTable
from core.base.query.queries import Queries
from core.base.query.conditions.among import Among
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.developer.support.developer_settings import HOOK_REQUEST_LOG_SETTING, HOOK_REQUEST_LOG_SIZE_SETTING
from core.modules.developer.models.hook_request import HookRequest
from engine.enums.hook_answer import HookAnswer
from core.modules.settings.bindings.support.setting_values import SettingValues

class HookRequestLog:
    """Keeps the configured number of completed requests and reads their display view."""

    def __init__(self, table: HookRequestsTable, queries: Queries, settings: SettingValues, clock: Clock, agents: AgentRows) -> None:
        self.table, self.queries, self.settings, self.clock = table, queries, settings, clock
        self.agents = agents

    def read(self) -> list[HookRequest]:
        return list(self.queries.query(HookRequest).descending("id").all_rows())

    def filter_options(self) -> list[tuple[str, str]]:
        return self.table.filter_options()

    def filtered(self, categories: list[str], families: list[str], senders: list[str]) -> list[HookRequest]:
        query = self.queries.query(HookRequest).descending("id")
        for column, values in (("category", categories), ("family", families), ("sender", senders)):
            if values:
                query = query.matching(Among(column, values))
        if not families:
            query = query.matching(Among("family", ["process bookkeeping"], negated=True))
        return list(query.all_rows())

    def record(self, program: str, headers: Mapping[str, str], body: object, duration_ms: float, outcome: HookAnswer, queued_ms: float = 0, role: str = "main", agent: str = "") -> bool:
        if not self.settings.project.flag(HOOK_REQUEST_LOG_SETTING):
            return False
        return self.save(program, headers, body, duration_ms, outcome, queued_ms, role, agent)

    def record_hook(self, program: str, headers: Mapping[str, str], body: object, duration_ms: float, outcome: HookAnswer, queued_ms: float, session: str) -> bool:
        if not self.settings.project.flag(HOOK_REQUEST_LOG_SETTING):
            return False
        agent = self.agents.session(session)
        return self.save(program, headers, body, duration_ms, outcome, queued_ms, agent.role if agent is not None else "main", str(agent.id) if agent is not None else "")

    def save(self, program: str, headers: Mapping[str, str], body: object, duration_ms: float, outcome: HookAnswer, queued_ms: float, role: str, agent: str) -> bool:
        self.table.record(self.payload(program, headers, body, duration_ms, outcome, queued_ms, role, agent), max(self.settings.project.number(HOOK_REQUEST_LOG_SIZE_SETTING), 1))
        return True

    def payload(self, program: str, headers: Mapping[str, str], body: object, duration_ms: float, outcome: HookAnswer, queued_ms: float, role: str, agent: str) -> str:
        received_at = (self.clock.timestamp().value - timedelta(milliseconds=duration_ms)).isoformat(timespec="microseconds")
        return json.dumps({"received_at": received_at, "program": program,
                              "headers": dict(headers), "body": body, "duration_ms": duration_ms, "queued_ms": queued_ms, "role": role, "agent": agent, "outcome": outcome.value})
