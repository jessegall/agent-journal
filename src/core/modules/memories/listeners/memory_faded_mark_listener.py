from core.base.change.logged_event import LoggedEvent
from core.base.change.event_log import EventLog
from core.base.command.bus import Bus
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.drivers.models.hook_call import HookCall
from core.modules.memories.listeners.memory_mark_listener import MemoryMarkListener
from core.modules.memories.models.enums.memory_mark_variant import MemoryMarkVariant
from core.modules.memories.models.memory import LOWEST_WEIGHT
from core.modules.memories.commands.fade_memories.fade_memories import FadeMemories


class MemoryFadedMarkListener(MemoryMarkListener):
    """After a compaction has faded an agent's memories, the chat shows how many of them are still shown."""

    name = "memories.faded-mark"
    event = "hook_call.create"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, events: EventLog) -> None:
        super().__init__(bus, actors, queries)
        self.events = events

    def handle(self, event: LoggedEvent) -> None:
        call = self.queries.query(HookCall).find(event.row_id)
        if not call.is_compaction:
            return
        changes = [change for change in self.events.child_events(event.id) if change.event == "memory.update" and change.command == FadeMemories.label()]
        if changes:
            shown = sum(change.data["weight"][1] != LOWEST_WEIGHT for change in changes)
            self.show_memory(event, MemoryMarkVariant.FADED, f"Memories faded by one: {shown} of {len(changes)} still shown", agent_id=call.agent_id, row_model="",
                             detail=self.round(changes))

    @staticmethod
    def round(changes: list[LoggedEvent]) -> str:
        return "\n".join(f"{'faded' if change.data['weight'][1] == LOWEST_WEIGHT else 'shown'}|{change.row_id}|{change.data['weight'][0]}|{change.data['weight'][1]}" for change in changes)
