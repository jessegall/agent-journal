from core.base.actor import Actor
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.drivers.models.hook_call import HookCall
from core.modules.memories.commands.fade_memories.fade_memories import FadeMemories
from core.base.change.created import Created


class CompactionFaderListener(CommitListener[Created[HookCall]]):
    """When an agent's context window is compacted, its memories of a fading type each lose one weight; a
    listener and not a driver rule, so an overlay that silences the rules, such as a wait, never stops the
    fading."""

    name = "memories.compaction-fader"

    def __init__(self, bus: Bus, queries: Queries) -> None:
        self.bus, self.queries = bus, queries

    def handle(self, event: Created[HookCall], logged: LoggedEvent) -> None:
        call = event.row
        if call.is_compaction:
            self.bus.run(FadeMemories(call.agent_id), Actor.core(), cause_id=logged.id, environment_id=logged.environment_id)
