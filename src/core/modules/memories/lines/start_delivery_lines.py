from collections.abc import Sequence
from engine.driver.nudge import Nudge
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.cli.row_numbers import RowNumbers
from engine.cli.agent_number import AGENT_MODEL_NAME
from core.modules.memories.nudges.start_memories_nudge import StartMemoriesNudge
from engine.enums.hook_event_name import HookEventName
from core.modules.memories.queries.active_memory_query import ActiveMemoryQuery


class StartDeliveryLines(EventLineSource):
    """At a session start and after a compaction, tells the agent how many active memories it is given;
    StartMemoriesListener records them."""

    key = "memories.start-delivery"
    events = [HookEventName.SESSION_START]

    def __init__(self, memories: ActiveMemoryQuery, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.memories = memories

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        count = self.memories.count()
        return [StartMemoriesNudge.declared().nudge(count=count, agent=self.numbers.number(AGENT_MODEL_NAME, agent_id))] if count else []
