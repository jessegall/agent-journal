from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.nudge import Nudge
from engine.enums.hook_event_name import HookEventName
from core.modules.messages.nudges.message_note_nudge import MessageNoteNudge
from core.modules.messages.nudges.reply_command_nudge import ReplyCommandNudge
from core.modules.messages.support.message_reads import MessageReads

MESSAGE_READ_KEY = "messages.read-marks-read"


class MessageReadLines(EventLineSource):
    """An agent that read messages addressed to it is told how to answer them, and asked to tag each untagged
    picture they carry."""

    key = MESSAGE_READ_KEY
    events = [HookEventName.POST_TOOL_USE]

    def __init__(self, reads: MessageReads) -> None:
        self.reads = reads

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        unread = self.reads.unread(event, agent_id) if event is not None else []
        if not unread:
            return []
        return [MessageNoteNudge.declared().nudge(), ReplyCommandNudge.declared().nudge(), *(nudge for message in unread for nudge in MessageReads.image_nudges(message))]
