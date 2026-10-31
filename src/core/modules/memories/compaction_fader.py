from core.base.actor import Actor
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.driver.hook_event_name import HookEventName
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.drivers.hook_call import HookCall
from core.modules.memories.memory_fade import MemoryFade


class CompactionFader(CommitListener):
    """When an agent's context window is compacted, its memories of a fading type each lose one weight; a listener
    and not a driver rule, so an overlay that silences the rules, such as a wait, never stops the fading."""

    name = "memories.compaction-fader"
    event = "hook_call.create"

    def __init__(self, bus: Bus, queries: Queries) -> None:
        self.bus, self.queries = bus, queries

    def handle(self, event: LoggedEvent) -> None:
        call = self.queries.query(HookCall).find(event.row_id)
        if call.hook == HookEventName.COMPACT:
            self.bus.run(MemoryFade(call.agent_id), Actor.core(), cause_id=event.id, environment_id=event.environment_id)
