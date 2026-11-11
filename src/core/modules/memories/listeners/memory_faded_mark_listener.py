from engine.event.logged_event import LoggedEvent
from engine.event.event_log import EventLog
from engine.command.bus import Bus
from engine.module.module_actors import ModuleActors
from engine.query.queries import Queries
from engine.listener.event_rows import EventRows
from core.modules.memories.listeners.memory_mark_listener import MemoryMarkListener
from core.modules.memories.models.enums.memory_mark_variant import MemoryMarkVariant
from core.modules.memories.models.memory import LOWEST_WEIGHT
from core.modules.memories.commands.fade_memories.fade_memories import FadeMemories
from engine.event.changed import Changed
from engine.event.deleted import Deleted
from core.modules.drivers.models.context_compaction import ContextCompaction


class MemoryFadedMarkListener(MemoryMarkListener[Changed[ContextCompaction]]):
    """After a compaction that ended has faded an agent's memories, the chat shows how many of them are still
    shown. The fades are the changes the fade command made right after the compaction ended."""

    name = "memories.faded-mark"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, events: EventLog, event_rows: EventRows) -> None:
        super().__init__(bus, actors, queries, event_rows)
        self.events = events

    def handle(self, event: Changed[ContextCompaction], logged: LoggedEvent) -> None:
        call = event.row
        if isinstance(event, Deleted) or not call.is_newly_ended(event.old_row):
            return
        changes = [change for change in self.events.events_after(logged.id) if change.event in ("memory.update", "memory.remove") and change.command == FadeMemories.label()]
        if changes:
            shown = sum(change.data["weight"][1] != LOWEST_WEIGHT for change in changes)
            self.show_memory(logged, MemoryMarkVariant.FADED, f"Memories faded by one: {shown} of {len(changes)} still shown", agent_id=call.session_agent_id, row_model="",
                             detail=self.round(changes))

    @staticmethod
    def round(changes: list[LoggedEvent]) -> str:
        return "\n".join(f"{'faded' if change.data['weight'][1] == LOWEST_WEIGHT else 'shown'}|{change.row_id}|{change.data['weight'][0]}|{change.data['weight'][1]}" for change in changes)
