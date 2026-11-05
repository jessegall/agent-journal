from collections.abc import Sequence
from typing import Self

from core.base.database.database import Database
from core.base.database.kept_rows import KeptRows
from core.base.database.statement import Statement
from core.base.timestamp import Timestamp
from core.base.driver.hook_event_name import HookEventName
from core.base.model.tables import Tables
from core.base.query.conditions.among import Among
from core.base.query.conditions.minimum import Minimum
from core.base.query.conditions.equal import Equal
from core.base.query.query import Query
from core.modules.drivers.models.support.views import tool_use_counts_select
from core.modules.drivers.models.enums.hook_answer import HookAnswer
from core.modules.drivers.models.hook_call import HookCall
from core.base.module.driver_entries import DRIVERS_MODULE

STOPS_READ = 20
TURN_HOOKS = (HookEventName.SESSION_START, HookEventName.PROMPT, HookEventName.PRE_TOOL_USE, HookEventName.POST_TOOL_USE, HookEventName.POST_TOOL_USE_FAILURE, HookEventName.STOP)
IDLE_LIMIT_SECONDS = 30
IDLE_HOOKS = (HookEventName.SESSION_START, HookEventName.STOP)
COMPACTION_LIMIT_SECONDS = 600


class HookCallQuery(Query[HookCall]):
    """Reads hook calls, with the questions the drivers module's rules ask of an agent's recent hooks."""

    def __init__(self, database: Database, tables: Tables, kept: KeptRows) -> None:
        super().__init__(database, tables, HookCall)
        self.kept = kept

    def agent(self, agent_id: int) -> Self:
        return self.filter(session_agent_id=agent_id)

    def stop_refusal_count(self, agent_id: int) -> int:
        stops = self.agent(agent_id).filter(hook=HookEventName.STOP).newest().limited(STOPS_READ)
        refused = [stop.answer == HookAnswer.REFUSED for stop in stops]
        return refused.index(False) if False in refused else len(refused)

    def last_stop_refused(self, agent_id: int) -> bool:
        stops = self.agent(agent_id).filter(hook=HookEventName.STOP).newest().limited(1)
        return bool(stops) and stops[0].answer == HookAnswer.REFUSED

    def is_idle(self, agent_id: int, checked_at: Timestamp) -> bool:
        call = self.kept.read(self.table.name, self.agent(agent_id).matching(Among("hook", TURN_HOOKS)).newest().first,
                              "session_agent_id = ? AND hook IN (?, ?, ?, ?, ?, ?)", [agent_id, *TURN_HOOKS], name="drivers.latest_turn")
        if call is None:
            return False
        is_silent = call.creation_timestamp().elapsed_seconds(checked_at) >= IDLE_LIMIT_SECONDS
        return is_silent or (call.hook in IDLE_HOOKS and call.answer == HookAnswer.ALLOWED and not call.is_compaction_start) or bool(call.metadata.module_part(DRIVERS_MODULE).get("interrupted"))

    def is_compacting(self, agent_id: int, checked_at: Timestamp) -> bool:
        call = self.kept.read(self.table.name, self.agent(agent_id).matching(Among("hook", (*TURN_HOOKS, HookEventName.COMPACT))).newest().first,
                              "session_agent_id = ? AND hook IN (?, ?, ?, ?, ?, ?, ?)", [agent_id, *TURN_HOOKS, HookEventName.COMPACT], name="drivers.latest_compaction_turn")
        return call is not None and call.is_compaction and call.creation_timestamp().elapsed_seconds(checked_at) < COMPACTION_LIMIT_SECONDS

    def write_count(self, agent_id: int, timestamp: Timestamp) -> int:
        return self.agent(agent_id).filter(writes_files=True, answer=HookAnswer.ALLOWED).matching(Minimum("created_at", timestamp.text)).count()

    def tool_call_count(self, agent_id: int, timestamp: Timestamp) -> int:
        return self.agent(agent_id).filter(hook=HookEventName.PRE_TOOL_USE).matching(Minimum("created_at", timestamp.text)).count()

    def tool_use_counts(self, agent_id: int, starts: Sequence[Timestamp]) -> list[int]:
        parameters = (*(start.text for start in starts), agent_id, HookEventName.PRE_TOOL_USE.value, min(start.text for start in starts))
        row = self.database.rows(Statement(tool_use_counts_select(len(starts)), parameters))[0]
        return [int(count) for count in row]

    def newest_agent_hook(self, agent_id: int) -> HookCall | None:
        return self.kept.read(self.table.name, self.agent(agent_id).matching(Equal("hook", HookEventName.TICK, negated=True)).newest().first,
                              "session_agent_id = ? AND hook <> ?", [agent_id, HookEventName.TICK], name="drivers.latest_agent_hook")
