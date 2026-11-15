from collections.abc import Sequence
from engine.driver.nudge import Nudge
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.messages.nudges.journal_chat_rule_nudge import JournalChatRuleNudge
from core.modules.messages.nudges.journal_laws_nudge import JournalLawsNudge
from core.modules.messages.nudges.journal_line_note_nudge import JournalLineNoteNudge


class ChatOpeningLines(EventLineSource):
    """A main agent's session start tells it what a journal line is, to keep the journal out of the chat, and
    that the laws apply."""

    key = "messages.chat-opening"
    events = [HookEventName.SESSION_START]
    agent_types = [AgentRole.MAIN.value]

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        return [JournalLineNoteNudge.declared().nudge(), JournalChatRuleNudge.declared().nudge(), JournalLawsNudge.declared().nudge()]
