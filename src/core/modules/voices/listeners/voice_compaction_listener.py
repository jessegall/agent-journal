from engine.enums.agent_role import AgentRole
from engine.listener.save_listener import SaveListener
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.voices.support.voice_lines import VoiceLines
from core.modules.voices.support.voice_nudges import VOICE_LINE
from core.modules.drivers.events.agent_compacted import AgentCompacted
from engine.command.context import Context


class VoiceCompactionListener(SaveListener[AgentCompacted]):
    """When a main agent's context is compacted it is told how to talk to the user again, without the
    introduction."""

    name = "voices.compaction"

    def __init__(self, queries: Queries, lines: VoiceLines) -> None:
        self.queries, self.lines = queries, lines

    def handle(self, event: AgentCompacted, context: Context) -> None:
        call = event.row
        if self.queries.query(Agent).find(call.session_agent_id).role == AgentRole.MAIN:
            self.lines.deliver(call.session_agent_id, VOICE_LINE, context)
