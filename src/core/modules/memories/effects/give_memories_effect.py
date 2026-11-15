from collections.abc import Sequence

from engine.agent.enums.role_group import RoleGroup
from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from core.modules.memories.commands.give_memories.give_memories import GiveMemories
from core.modules.memories.lines.keyword_delivery_lines import KEYWORD_DELIVERY_KEY, KEYWORD_EVENTS
from core.modules.memories.models.enums.delivery_cause import DeliveryCause
from core.modules.memories.support.keyword_memories import KeywordMemories


class GiveMemoriesEffect(EventEffect):
    """Records the memories a keyword brought back as given, so the agent is not given them again before its next
    compaction."""

    key = KEYWORD_DELIVERY_KEY
    events = KEYWORD_EVENTS
    role_group = RoleGroup.PROMPT

    def __init__(self, memories: KeywordMemories) -> None:
        self.memories = memories

    def commands_of(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        memory_ids = self.memories.memory_ids(event, agent_id) if event is not None else ()
        return [GiveMemories(agent_id, memory_ids, DeliveryCause.KEYWORD)] if memory_ids else []
