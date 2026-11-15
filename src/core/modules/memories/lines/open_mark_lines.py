from collections.abc import Sequence

from engine.agent.enums.role_group import RoleGroup
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.hook_event_name import HookEventName
from core.modules.memories.agent_messages.weigh_memories_message import WeighMemoriesMessage
from core.modules.memories.support.marks.reached_mark import ReachedMark

OPEN_MARK_KEY = "memories.open-mark"


class OpenMarkLines(EventLineSource):
    """An agent whose context passed a memory mark is given its memories, heaviest first, to weigh; a jump past two
    marks gives one line, naming the highest."""

    key = OPEN_MARK_KEY
    events = [HookEventName.POST_TOOL_USE]
    role_group = RoleGroup.MARK

    def __init__(self, marks: ReachedMark) -> None:
        self.marks = marks

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        mark = self.marks.reached(event, agent_id) if event is not None else None
        if mark is None:
            return []
        memories = ",".join(str(memory_id) for memory_id in mark.memory_ids)
        return [WeighMemoriesMessage.declared().agent_message(percent=mark.percent, uses=mark.tool_uses, count=len(mark.memory_ids), memories=memories)]
