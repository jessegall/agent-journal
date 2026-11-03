from typing import Self

from core.base.database.database import Database
from core.base.timestamp import Timestamp
from core.base.driver.hook_event_name import HookEventName
from core.base.model.tables import Tables
from core.base.query.conditions.among import Among
from core.base.query.conditions.minimum import Minimum
from core.base.query.conditions.equal import Equal
from core.base.query.query import Query
from core.modules.drivers.models.enums.hook_answer import HookAnswer
from core.modules.drivers.models.hook_call import HookCall
from core.base.module.driver_entries import DRIVERS_MODULE

STOPS_READ = 20
TURN_HOOKS = (HookEventName.SESSION_START, HookEventName.PROMPT, HookEventName.PRE_TOOL_USE, HookEventName.POST_TOOL_USE, HookEventName.POST_TOOL_USE_FAILURE, HookEventName.STOP)
IDLE_LIMIT_SECONDS = 30
IDLE_HOOKS = (HookEventName.SESSION_START, HookEventName.STOP)


class HookCallQuery(Query[HookCall]):
    """Reads hook calls, with the questions the drivers module's rules ask of an agent's recent hooks."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, HookCall)

    def agent(self, agent_id: int) -> Self:
        return self.filter(agent_id=agent_id)

    def stop_refusal_count(self, agent_id: int) -> int:
        stops = self.agent(agent_id).filter(hook=HookEventName.STOP).newest().limited(STOPS_READ)
        refused = [stop.answer == HookAnswer.REFUSED for stop in stops]
        return refused.index(False) if False in refused else len(refused)

    def last_stop_refused(self, agent_id: int) -> bool:
        stops = self.agent(agent_id).filter(hook=HookEventName.STOP).newest().limited(1)
        return bool(stops) and stops[0].answer == HookAnswer.REFUSED

    def is_idle(self, agent_id: int, current_time: Timestamp) -> bool:
        calls = self.agent(agent_id).matching(Among("hook", TURN_HOOKS)).newest().limited(1)
        if not calls:
            return False
        is_silent = calls[0].creation_timestamp().elapsed_seconds(current_time) >= IDLE_LIMIT_SECONDS
        return is_silent or (calls[0].hook in IDLE_HOOKS and calls[0].answer == HookAnswer.ALLOWED) or bool(calls[0].metadata.module_part(DRIVERS_MODULE).get("interrupted"))

    def write_count(self, agent_id: int, timestamp: Timestamp) -> int:
        return self.agent(agent_id).filter(writes_files=True, answer=HookAnswer.ALLOWED).matching(Minimum("created_at", timestamp.text)).count()

    def tool_call_count(self, agent_id: int, timestamp: Timestamp) -> int:
        return self.agent(agent_id).filter(hook=HookEventName.PRE_TOOL_USE).matching(Minimum("created_at", timestamp.text)).count()

    def newest_agent_hook(self, agent_id: int) -> HookCall | None:
        calls = self.agent(agent_id).matching(Equal("hook", HookEventName.TICK, negated=True)).newest().limited(1)
        return calls[0] if calls else None
