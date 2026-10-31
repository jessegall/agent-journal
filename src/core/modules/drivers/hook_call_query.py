from typing import Self

from core.base.database.database import Database
from core.base.driver.hook_event_name import HookEventName
from core.base.model.tables import Tables
from core.base.query.query import Query
from core.modules.drivers.hook_answer import HookAnswer
from core.modules.drivers.hook_call import HookCall

STOPS_READ = 20


class HookCallQuery(Query[HookCall]):
    """Reads hook calls, with the questions the drivers module's rules ask of an agent's recent hooks."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, HookCall)

    def agent(self, agent_id: int) -> Self:
        return self.filter(agent_id=agent_id)

    def refused_stop_streak(self, agent_id: int) -> int:
        stops = self.agent(agent_id).filter(hook=HookEventName.STOP).newest().page(1, STOPS_READ).rows
        refused = [stop.answer == HookAnswer.REFUSED for stop in stops]
        return refused.index(False) if False in refused else len(refused)
