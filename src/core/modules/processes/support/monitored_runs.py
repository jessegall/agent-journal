from engine.time.clock import Clock
from core.base.database.kept_rows import KeptRows
from engine.enums.hook_answer import HookAnswer
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.watched_runs import WatchedRuns
from core.base.model.tables import Tables
from core.base.query.queries import Queries
from core.modules.drivers.models.hook_call import HookCall
from core.modules.processes.models.process import Process
from core.modules.processes.queries.process_query import OPEN, ProcessQuery

MONITOR_TOOL = "Monitor"
MONITOR_LIFE_SECONDS = 1800


class MonitoredRuns(WatchedRuns):
    """An agent watches a run when one of its runs is going and a Monitor it was allowed to start since that
    run began can still be alive."""

    def __init__(self, processes: ProcessQuery, queries: Queries, clock: Clock, kept: KeptRows, tables: Tables) -> None:
        self.processes, self.queries, self.clock, self.kept, self.tables = processes, queries, clock, kept, tables

    def newest_run(self, agent_id: int) -> Process | None:
        return self.kept.scoped_read(self.tables.table(Process).name, self.processes.agent(agent_id).running().newest().first,
                                     "session_agent_id = ? AND state IN (?, ?)", [agent_id, *OPEN], name="processes.newest_run")

    def newest_monitor(self, agent_id: int) -> HookCall | None:
        return self.kept.scoped_read(self.tables.table(HookCall).name,
                                     self.queries.query(HookCall).filter(session_agent_id=agent_id, hook=HookEventName.PRE_TOOL_USE, tool=MONITOR_TOOL, answer=HookAnswer.ALLOWED).newest().first,
                                     "session_agent_id = ? AND hook = ? AND tool = ? AND answer = ?",
                                     [agent_id, HookEventName.PRE_TOOL_USE, MONITOR_TOOL, HookAnswer.ALLOWED], name="processes.newest_monitor")

    def is_watching(self, agent_id: int) -> bool:
        run = self.newest_run(agent_id)
        monitor = self.newest_monitor(agent_id)
        if run is None or monitor is None or monitor.creation_timestamp().value < run.creation_timestamp().value:
            return False
        return monitor.creation_timestamp().elapsed_seconds(self.clock.timestamp()) < MONITOR_LIFE_SECONDS
