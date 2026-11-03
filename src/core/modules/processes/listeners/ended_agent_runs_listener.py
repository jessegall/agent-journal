from core.base.agent_role import AgentRole
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.processes.commands.orphan_process.orphan_process import OrphanProcess
from core.modules.processes.listeners.process_end_mark_listener import MODULE_NAME
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.agents.models.agent import ENDED_FIELD, Agent


class EndedAgentRunsListener(CommitListener):
    """When an agent ends, the runs it left going end as lost, since no agent is left to hear of them. A worker's
    runs go on: it is started again to hear of them."""

    name = "processes.ended-agent-runs"
    event = "agent.*"

    def __init__(self, bus: Bus, actors: ModuleActors, processes: ProcessQuery, queries: Queries) -> None:
        self.bus, self.actors, self.processes, self.queries = bus, actors, processes, queries

    def handle(self, event: LoggedEvent) -> None:
        if ENDED_FIELD not in event.data or event.data[ENDED_FIELD][1] is None:
            return
        if self.queries.query(Agent).find(event.row_id).role is AgentRole.WORKER:
            return
        for process in tuple(self.processes.agent(event.row_id).running().all_rows()):
            self.bus.run(OrphanProcess(process.id), self.actors.actor(MODULE_NAME), cause_id=event.id, environment_id=event.environment_id)
