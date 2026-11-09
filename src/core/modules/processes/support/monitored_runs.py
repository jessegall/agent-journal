from core.base.clock import Clock
from core.base.database.kept_rows import KeptRows
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.drivers.models.enums.hook_answer import HookAnswer
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.watched_runs import WatchedRuns
from core.base.query.queries import Queries
from core.modules.drivers.models.hook_call import HookCall
from core.modules.processes.queries.process_query import ProcessQuery

MONITOR_TOOL = "Monitor"
MONITOR_LIFE_SECONDS = 1800


class MonitoredRuns(WatchedRuns):
    """An agent watches a run when one of its runs is going and a Monitor it was allowed to start since that
    run began can still be alive."""

    def __init__(self, processes: ProcessQuery, queries: Queries, clock: Clock, kept: KeptRows) -> None:
        self.processes, self.queries, self.clock, self.kept = processes, queries, clock, kept

    def is_watching(self, agent_id: int) -> bool:
        run = self.kept.scoped_read("processes", self.processes.agent(agent_id).running().newest().first, "session_agent_id = ? AND state IN (?, ?)",
                                    [agent_id, ProcessState.RUNNING, ProcessState.BACKGROUND], name="processes.newest_open_run")
        monitor = self.kept.read("hook_calls", self.queries.query(HookCall).filter(session_agent_id=agent_id, hook=HookEventName.PRE_TOOL_USE, tool=MONITOR_TOOL, answer=HookAnswer.ALLOWED).newest().first,
                                 "session_agent_id = ? AND hook = ? AND tool = ? AND answer = ?",
                                 [agent_id, HookEventName.PRE_TOOL_USE, MONITOR_TOOL, HookAnswer.ALLOWED], name="processes.newest_monitor")
        if run is None or monitor is None or monitor.creation_timestamp().value < run.creation_timestamp().value:
            return False
        return monitor.creation_timestamp().elapsed_seconds(self.clock.timestamp()) < MONITOR_LIFE_SECONDS
