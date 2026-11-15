from collections.abc import Sequence

from engine.agent.enums.role_group import RoleGroup
from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.hook_event_name import HookEventName
from core.modules.memories.commands.open_memory_mark.open_memory_mark import OpenMemoryMark
from core.modules.memories.lines.open_mark_lines import OPEN_MARK_KEY
from core.modules.memories.support.reached_mark import ReachedMark


class OpenMarkEffect(EventEffect):
    """Opens the memory mark the agent's context passed; its block is planned by MemoryMarkNeeds."""

    key = OPEN_MARK_KEY
    events = [HookEventName.POST_TOOL_USE]
    role_group = RoleGroup.MARK

    def __init__(self, marks: ReachedMark) -> None:
        self.marks = marks

    def commands_of(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        mark = self.marks.reached(event, agent_id) if event is not None else None
        return [OpenMemoryMark(agent_id, mark.percent)] if mark is not None else []
