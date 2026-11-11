from core.modules.agents.events.agent_ended import AgentEnded
from core.modules.drivers.support.suite_choice import SuiteChoice
from engine.event.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.listener.commit.commit_listener import CommitListener
from engine.module.module_actors import ModuleActors
from engine.query.queries import Queries
from core.modules.processes.commands.orphan_process.orphan_process import OrphanProcess
from core.modules.processes.listeners.process_end_mark_listener import MODULE_NAME
from core.modules.processes.queries.process_query import ProcessQuery


class EndedAgentRunsListener(CommitListener[AgentEnded]):
    """Ends an agent's runs unless its suite declares that they continue after the agent stops."""

    name = "processes.ended-agent-runs"

    def __init__(self, bus: Bus, actors: ModuleActors, processes: ProcessQuery, queries: Queries, suites: SuiteChoice) -> None:
        self.bus, self.actors, self.processes, self.queries = bus, actors, processes, queries
        self.suites = suites

    def handle(self, event: AgentEnded, logged: LoggedEvent) -> None:
        agent = event.row
        if agent.role in self.suites.agent_policy().continuing_run_roles:
            return
        for process in tuple(self.processes.agent(logged.row_id).running().all_rows()):
            self.bus.run(OrphanProcess(process.id), self.actors.actor(MODULE_NAME), cause_id=logged.id)
