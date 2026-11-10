from engine.actor.actor import Actor
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from engine.query.queries import Queries
from core.modules.memories.commands.fade_memories.fade_memories import FadeMemories
from core.modules.drivers.events.agent_compacted import AgentCompacted


class CompactionFaderListener(CommitListener[AgentCompacted]):
    """When an agent's context window is compacted, its memories of a fading type each lose one weight; a
    listener and not a driver rule, so an overlay that silences the rules, such as a wait, never stops the
    fading."""

    name = "memories.compaction-fader"

    def __init__(self, bus: Bus, queries: Queries) -> None:
        self.bus, self.queries = bus, queries

    def handle(self, event: AgentCompacted, logged: LoggedEvent) -> None:
        call = event.row
        self.bus.run(FadeMemories(call.session_agent_id), Actor.core(), cause_id=logged.id)
