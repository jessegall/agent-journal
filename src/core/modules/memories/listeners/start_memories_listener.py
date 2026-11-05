from core.modules.drivers.support.suite_choice import SuiteChoice
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.memories.commands.give_memories.give_memories import GiveMemories
from core.modules.memories.models.enums.delivery_cause import DeliveryCause
from core.base.scope.scopes import Scopes
from core.modules.memories.queries.active_memory_query import ActiveMemoryQuery
from core.modules.drivers.events.session_started import SessionStarted

MODULE_NAME = "journal.core.memories"


class StartMemoriesListener(CommitListener[SessionStarted]):
    """Records the memories a session start gave its agent after the hook has answered, heaviest first, so a hook
    costs the same however many memories the project holds; one a keyword gave first is not given again."""

    name = "memories.start-memories"

    def __init__(self, memories: ActiveMemoryQuery, agents: AgentRows, bus: Bus, actors: ModuleActors, suites: SuiteChoice, scopes: Scopes) -> None:
        self.memories, self.agents, self.bus, self.actors = memories, agents, bus, actors
        self.suites, self.scopes = suites, scopes

    def handle(self, event: SessionStarted, logged: LoggedEvent) -> None:
        call = event.row
        if self.agents.find(call.session_agent_id).role not in self.suites.agent_policy().prompt_roles:
            return
        with self.scopes.opened(call.session_agent_id):
            memory_ids = tuple(row.memory_id for row in self.memories.absent_memories(call.session_agent_id).weight_order().all_rows())
        if memory_ids:
            self.bus.run(GiveMemories(call.session_agent_id, memory_ids, DeliveryCause.START), self.actors.actor(MODULE_NAME), cause_id=logged.id)
