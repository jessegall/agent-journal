from engine.helper_type.helper_type_book import HelperTypeBook
from core.modules.agents.events.agent_ended import AgentEnded
from engine.event.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.listener.commit.commit_listener import CommitListener
from engine.module.module_actors import ModuleActors
from engine.query.queries import Queries
from core.modules.processes.commands.orphan_process.orphan_process import OrphanProcess
from core.modules.processes.listeners.process_end_mark_listener import MODULE_NAME
from core.modules.processes.queries.process_query import ProcessQuery

ORPHANED_RUNS_REASON = "an ended agent leaves every run it still has running orphaned"


class EndedAgentRunsListener(CommitListener[AgentEnded]):
    """Ends an agent's runs unless its suite declares that they continue after the agent stops."""

    name = "processes.ended-agent-runs"

    def __init__(self, bus: Bus, actors: ModuleActors, processes: ProcessQuery, queries: Queries, types: HelperTypeBook) -> None:
        self.bus, self.actors, self.processes, self.queries = bus, actors, processes, queries
        self.types = types

    def handle(self, event: AgentEnded, logged: LoggedEvent) -> None:
        agent = event.row
        if self.types.behaviours(agent.role).continues_runs:
            return
        for process in tuple(self.processes.agent(logged.row_id).running().every_row(ORPHANED_RUNS_REASON)):
            self.bus.run(OrphanProcess(process.id), self.actors.actor(MODULE_NAME), cause_id=logged.id)
