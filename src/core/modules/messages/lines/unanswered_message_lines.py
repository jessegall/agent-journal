from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.nudge import Nudge
from engine.enums.hook_event_name import HookEventName
from core.modules.messages.needs.unanswered_message_needs import ANSWERING_TYPES, UNANSWERED_RULE
from core.modules.messages.nudges.unanswered_nudge import UnansweredNudge
from core.modules.messages.support.unanswered_messages import UnansweredMessages


class UnansweredMessageLines(EventLineSource):
    """A message the main agent or a read-only helper read and has not answered is named before each tool call; a
    journal message line and the task a message asks for go through, since they are the answer."""

    key = UNANSWERED_RULE
    events = [HookEventName.PRE_TOOL_USE]
    agent_types = list(ANSWERING_TYPES)

    def __init__(self, unanswered: UnansweredMessages) -> None:
        self.unanswered = unanswered

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        if event is None or UnansweredMessageLines.answers(event):
            return []
        unanswered = self.unanswered.unanswered(agent_id)
        return [UnansweredNudge.declared().nudge(messages=", ".join(str(message.id) for message in unanswered))] if unanswered else []

    @staticmethod
    def answers(event: HookEvent) -> bool:
        tool = event.tool
        return tool is not None and tool.shell is not None and tool.shell.parts_running_journal_command("message", "task make")
