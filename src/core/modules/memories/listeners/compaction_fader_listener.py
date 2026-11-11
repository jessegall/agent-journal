from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.command.context import Context
from engine.event.changed import Changed
from engine.event.deleted import Deleted
from engine.listener.save_listener import SaveListener
from core.modules.drivers.models.context_compaction import ContextCompaction
from core.modules.memories.commands.fade_memories.fade_memories import FadeMemories


class CompactionFaderListener(SaveListener[Changed[ContextCompaction]]):
    """An agent's memories each lose one weight once a compaction of its context has really ended, which is
    when the agent's session starts again after it and before the agent is given its memories. A compaction
    that was only asked for, started and cancelled, or failed lowers nothing, and one compaction lowers once.
    A listener and not a driver rule, so an overlay that silences the rules, such as a wait, never stops the
    fading."""

    name = "memories.compaction-fader"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: Changed[ContextCompaction], context: Context) -> None:
        if isinstance(event, Deleted) or not event.row.is_newly_ended(event.old_row):
            return
        self.bus.run(FadeMemories(event.row.session_agent_id), Actor.core(), environment_id=context.environment_id)
