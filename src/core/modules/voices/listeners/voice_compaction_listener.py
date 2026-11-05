from core.base.agent_role import AgentRole
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.hook_call import HookCall
from core.modules.voices.support.voice_lines import VoiceLines
from core.modules.voices.support.voice_nudges import VOICE_LINE
from core.base.change.created import Created
from core.base.command.context import Context


class VoiceCompactionListener(SaveListener[Created[HookCall]]):
    """When a main agent's context is compacted it is told how to talk to the user again, without the
    introduction."""

    name = "voices.compaction"

    def __init__(self, queries: Queries, lines: VoiceLines) -> None:
        self.queries, self.lines = queries, lines

    def handle(self, event: Created[HookCall], context: Context) -> None:
        call = event.row
        if not isinstance(call, HookCall) or not call.is_compaction:
            return
        if self.queries.query(Agent).find(call.agent_id).role == AgentRole.MAIN:
            self.lines.deliver(call.agent_id, VOICE_LINE, context)
