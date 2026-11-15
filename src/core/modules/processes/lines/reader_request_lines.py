from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.needs.reader_request_needs import READER_REQUEST_KEY
from core.modules.processes.support.reading.reader_request_blocks import ReaderRequestBlocks


class ReaderRequestLines(EventLineSource):
    """Asks an agent for the reader its request waits on, and the main agent for help after failed saves."""

    key = READER_REQUEST_KEY
    events = [event for event in HookEventName if event is not HookEventName.TICK]

    def __init__(self, blocks: ReaderRequestBlocks) -> None:
        self.blocks = blocks

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        return self.blocks.answer(event, agent_id).nudges if event is not None else []
