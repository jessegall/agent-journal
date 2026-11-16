from collections.abc import Sequence
from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.cli.row_numbers import RowNumbers
from core.modules.memories.agent_messages.start_memories_message import StartMemoriesMessage
from engine.enums.hook_event_name import HookEventName
from core.modules.memories.queries.active_memory_query import ActiveMemoryQuery


class StartDeliveryLines(EventLineSource):
    """At a session start and after a compaction, tells the agent how many active memories it is given;
    StartMemoriesListener records them."""

    start_line = True
    key = "memories.start-delivery"
    events = [HookEventName.SESSION_START]

    def __init__(self, memories: ActiveMemoryQuery, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.memories = memories

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        count = self.memories.count()
        return [StartMemoriesMessage.declared().agent_message(count=count, agent=self.numbers.agent_number(agent_id))] if count else []
