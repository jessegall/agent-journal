from collections.abc import Sequence
from engine.driver.nudge import Nudge
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.messages.nudges.reply_note_nudge import ReplyNoteNudge


class ReplyNoteLines(EventLineSource):
    """After a reply sent by command the main agent is told it is in the chat, so words after it are not written."""

    key = "messages.reply-note"
    events = [HookEventName.POST_TOOL_USE]
    agent_types = [AgentRole.MAIN.value]

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        shell = event.tool.shell if event.tool is not None else None
        replies = shell.journal_command_numbers("message reply") if shell is not None else ()
        return [ReplyNoteNudge.declared().nudge(message=replies[0])] if replies else []
