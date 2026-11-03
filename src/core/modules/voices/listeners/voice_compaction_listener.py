from core.base.agent_role import AgentRole
from core.base.change.change import Change
from core.base.driver.hook_event_name import HookEventName
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.hook_call import HookCall
from core.modules.voices.support.voice_lines import VoiceLines
from core.modules.voices.support.voice_nudges import VOICE_LINE


class VoiceCompactionListener(SaveListener):
    """When a main agent's context is compacted it is told how to talk to the user again, without the introduction."""

    name = "voices.compaction"
    event = "hook_call.create"

    def __init__(self, queries: Queries, lines: VoiceLines) -> None:
        self.queries, self.lines = queries, lines

    def handle(self, change: Change[Model]) -> None:
        call = change.new_row
        if isinstance(call, HookCall) and call.hook == HookEventName.COMPACT and self.queries.query(Agent).find(call.agent_id).role is AgentRole.MAIN:
            self.lines.tell(call.agent_id, VOICE_LINE, change)
