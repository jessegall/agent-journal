from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.modules.processes.commands.orphan_process.orphan_process import OrphanProcess
from core.modules.processes.listeners.process_end_mark_listener import MODULE_NAME
from core.modules.processes.queries.process_query import ProcessQuery

ENDED_FIELD = "ended_at"


class EndedAgentRunsListener(CommitListener):
    """When an agent ends, the runs it left going end as lost, since no agent is left to hear of them."""

    name = "processes.ended-agent-runs"
    event = "agent.*"

    def __init__(self, bus: Bus, actors: ModuleActors, processes: ProcessQuery) -> None:
        self.bus, self.actors, self.processes = bus, actors, processes

    def handle(self, event: LoggedEvent) -> None:
        if ENDED_FIELD not in event.data or event.data[ENDED_FIELD][1] is None:
            return
        for process in tuple(self.processes.agent(event.row_id).running().all_rows()):
            self.bus.run(OrphanProcess(process.id), self.actors.actor(MODULE_NAME), cause_id=event.id, environment_id=event.environment_id)
