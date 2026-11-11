from engine.command.bus import Bus
from engine.event.logged_event import LoggedEvent
from engine.listener.event_rows import EventRows
from engine.module.module_actors import ModuleActors
from engine.query.queries import Queries
from core.modules.agents.events.agent_ended import AgentEnded
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from suites.coding.modules.workers.listeners.worker_stop_mark_listener import WorkerStopMarkListener
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant
from suites.coding.modules.workers.support.stop_facts_reader import StopFactsReader
from suites.coding.modules.workers.support.worker_stop_detail import WorkerStopDetail
from suites.coding.modules.workers.support.worker_unfinished_tasks import WorkerUnfinishedTasks


class WorkerStoppedMarkListener(WorkerStopMarkListener[AgentEnded]):
    """A worker that stops with tasks left shows as a mark in the main chat, unless the reading of its stop says
    its work still goes. The same reading decides the line about the stop."""

    name = "workers.stopped-mark"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, unfinished: WorkerUnfinishedTasks, detail: WorkerStopDetail, event_rows: EventRows, stop_facts: StopFactsReader) -> None:
        super().__init__(bus, actors, queries, unfinished, detail, event_rows)
        self.stop_facts = stop_facts

    def handle(self, event: AgentEnded, logged: LoggedEvent) -> None:
        worker = event.row
        if worker.role != CodingHelperRole.WORKER:
            return
        facts = self.stop_facts.read(worker, logged.actor_id)
        if facts is not None and facts.reading().shows_card:
            tasks = self.unfinished.rows(worker.id)
            self.show_stop(logged, worker, WorkerMarkVariant.ENDED_EARLY, f"stopped with {len(tasks)} tasks left", tasks)
