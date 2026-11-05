from core.modules.drivers.support.suite_choice import SuiteChoice
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
from core.base.change.created import Created

MODULE_NAME = "journal.core.memories"


class StartMemoriesListener(CommitListener[Created[HookCall]]):
    """Records the memories a session start gave its agent after the hook has answered, heaviest first, so a hook
    costs the same however many memories the project holds; one a keyword gave first is not given again."""

    name = "memories.start-memories"

    def __init__(self, memories: HookMemories, queries: Queries, bus: Bus, actors: ModuleActors, suites: SuiteChoice) -> None:
        self.memories, self.queries, self.bus, self.actors = memories, queries, bus, actors
        self.suites = suites

    def handle(self, event: Created[HookCall], logged: LoggedEvent) -> None:
        call = event.row
        if not call.is_session_start or self.queries.query(Agent).find(call.agent_id).role not in self.suites.agent_policy(call.environment_id).prompt_roles:
            return
        rows = self.memories.agent_query(call.agent_id, call.environment_id).absent_memories(call.agent_id).weight_order().all_rows()
        memory_ids = tuple(row.memory_id for row in rows)
        if memory_ids:
            self.bus.run(GiveMemories(call.agent_id, memory_ids, DeliveryCause.START), self.actors.actor(MODULE_NAME), cause_id=logged.id, environment_id=call.environment_id)
