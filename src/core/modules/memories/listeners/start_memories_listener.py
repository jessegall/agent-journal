from core.base.agent_role import AgentRole
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.hook_call import HookCall
from core.modules.memories.commands.give_memories.give_memories import GiveMemories
from core.modules.memories.models.enums.delivery_cause import DeliveryCause
from core.modules.memories.rules.support.hook_memories import HookMemories

MODULE_NAME = "journal.core.memories"
GIVEN_ROLES = (AgentRole.MAIN, AgentRole.WORKER)


class StartMemoriesListener(CommitListener):
    """Records the memories a session start gave its agent after the hook has answered, rules first, facts heaviest
    first, so a hook costs the same however many memories the project holds."""

    name = "memories.start-memories"
    event = "hook_call.create"

    def __init__(self, memories: HookMemories, queries: Queries, bus: Bus, actors: ModuleActors) -> None:
        self.memories, self.queries, self.bus, self.actors = memories, queries, bus, actors

    def handle(self, event: LoggedEvent) -> None:
        call = self.queries.query(HookCall).find(event.row_id)
        if not call.is_session_start or self.queries.query(Agent).find(call.agent_id).role not in GIVEN_ROLES:
            return
        rows = self.memories.agent_query(call.agent_id, call.environment_id).start_memories().undated().delivery_order().all_rows()
        memory_ids = tuple(row.memory_id for row in rows)
        if memory_ids:
            self.bus.run(GiveMemories(call.agent_id, memory_ids, DeliveryCause.START), self.actors.actor(MODULE_NAME), cause_id=event.id, environment_id=call.environment_id)
