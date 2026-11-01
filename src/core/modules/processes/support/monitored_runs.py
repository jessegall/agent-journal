from core.base.clock import Clock
from core.modules.drivers.models.enums.hook_answer import HookAnswer
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.watched_runs import WatchedRuns
from core.base.query.queries import Queries
from core.modules.drivers.models.hook_call import HookCall
from core.modules.processes.queries.process_query import ProcessQuery

MONITOR_TOOL = "Monitor"
MONITOR_LIFE_SECONDS = 1800


class MonitoredRuns(WatchedRuns):
    """An agent watches a run when one of its runs is going and a Monitor it was allowed to start since that run began can still be alive."""

    def __init__(self, processes: ProcessQuery, queries: Queries, clock: Clock) -> None:
        self.processes, self.queries, self.clock = processes, queries, clock

    def is_watching(self, agent_id: int) -> bool:
        runs = self.processes.agent(agent_id).running().newest().page(1, 1).rows
        monitors = self.queries.query(HookCall).filter(agent_id=agent_id, hook=HookEventName.PRE_TOOL_USE, tool=MONITOR_TOOL, answer=HookAnswer.ALLOWED).newest().page(1, 1).rows
        if not runs or not monitors or monitors[0].creation_timestamp().value < runs[0].creation_timestamp().value:
            return False
        return monitors[0].creation_timestamp().elapsed_seconds(self.clock.timestamp()) < MONITOR_LIFE_SECONDS
