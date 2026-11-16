from collections.abc import Sequence

from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.hook_event_name import HookEventName
from core.modules.messages.commands.read_message.note_message_read import NoteMessageRead
from core.modules.messages.lines.message_read_lines import MESSAGE_READ_KEY
from core.modules.messages.support.message_reads import MessageReads


class MessageReadEffect(EventEffect):
    """Notes each message its target agent read as read."""

    key = MESSAGE_READ_KEY
    events = [HookEventName.POST_TOOL_USE]

    def __init__(self, reads: MessageReads) -> None:
        self.reads = reads

    def effect_commands(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        return [NoteMessageRead(message.id) for message in self.reads.unread(event, agent_id)] if event is not None else []
