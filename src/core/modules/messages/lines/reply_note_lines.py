from collections.abc import Sequence
from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.messages.agent_messages.reply_note_message import ReplyNoteMessage


class ReplyNoteLines(EventLineSource):
    """After a reply sent by command the main agent is told it is in the chat, so words after it are not written."""

    key = "messages.reply-note"
    events = [HookEventName.POST_TOOL_USE]
    agent_types = [AgentRole.MAIN.value]

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        shell = event.tool.shell if event.tool is not None else None
        replies = shell.journal_command_numbers("message reply") if shell is not None else ()
        return [ReplyNoteMessage.declared().agent_message(message=replies[0])] if replies else []
