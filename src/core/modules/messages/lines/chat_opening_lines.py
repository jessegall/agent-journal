from collections.abc import Sequence
from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.messages.agent_messages.journal_chat_rule_message import JournalChatRuleMessage
from core.modules.messages.agent_messages.journal_laws_message import JournalLawsMessage
from core.modules.messages.agent_messages.journal_line_note_message import JournalLineNoteMessage


class ChatOpeningLines(EventLineSource):
    """A main agent's session start tells it what a journal line is, to keep the journal out of the chat, and
    that the laws apply."""

    start_line = True
    key = "messages.chat-opening"
    events = [HookEventName.SESSION_START]
    agent_types = [AgentRole.MAIN.value]

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        return [JournalLineNoteMessage.declared().agent_message(), JournalChatRuleMessage.declared().agent_message(), JournalLawsMessage.declared().agent_message()]
