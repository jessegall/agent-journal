from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.drivers.models.hook_call import HookCall
from core.base.driver.hook_event_name import HookEventName
from core.modules.memories.listeners.memory_mark_listener import MemoryMarkListener
from core.modules.memories.models.enums.memory_mark_variant import MemoryMarkVariant
from core.modules.memories.support.fading_scope import FadingScope


class MemoryFadedMarkListener(MemoryMarkListener):
    """After a compaction has faded an agent's memories, the chat shows how many of them are still shown."""

    name = "memories.faded-mark"
    event = "hook_call.create"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, scope: FadingScope) -> None:
        super().__init__(bus, actors)
        self.queries, self.scope = queries, scope

    def handle(self, event: LoggedEvent) -> None:
        call = self.queries.query(HookCall).find(event.row_id)
        memories = self.scope.memories(call.agent_id) if call.hook == HookEventName.COMPACT else []
        if memories:
            shown = len([memory for memory in memories if memory.weight > 0])
            self.show(event, MemoryMarkVariant.FADED, f"Memories faded by one: {shown} of {len(memories)} still shown", agent_id=call.agent_id, row_model="")
