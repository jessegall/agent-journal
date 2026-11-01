from core.base.driver.hook_event_name import HookEventName
from core.base.driver.watched_runs import WatchedRuns
from core.base.query.queries import Queries
from core.modules.drivers.models.hook_call import HookCall
from core.modules.processes.queries.process_query import ProcessQuery

MONITOR_TOOL = "Monitor"


class MonitoredRuns(WatchedRuns):
    """An agent watches a run when one of its runs is going and it has started a Monitor since that run began."""

    def __init__(self, processes: ProcessQuery, queries: Queries) -> None:
        self.processes, self.queries = processes, queries

    def is_watching(self, agent_id: int) -> bool:
        runs = self.processes.agent(agent_id).running().newest().page(1, 1).rows
        monitors = self.queries.query(HookCall).filter(agent_id=agent_id, hook=HookEventName.PRE_TOOL_USE, tool=MONITOR_TOOL).newest().page(1, 1).rows
        return bool(runs) and bool(monitors) and monitors[0].creation_timestamp().value >= runs[0].creation_timestamp().value
