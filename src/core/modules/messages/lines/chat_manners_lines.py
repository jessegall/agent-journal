from collections.abc import Sequence
from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
import re

from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.driver.message_template import MessageTemplate
from engine.query.queries import Queries
from engine.registry.registry import Registry
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from core.modules.messages.agent_messages.paragraph_message import ParagraphMessage
from core.modules.messages.agent_messages.em_dash_message import EmDashMessage
from core.modules.messages.agent_messages.shop_talk_message import ShopTalkMessage
from core.modules.messages.agent_messages.third_person_message import ThirdPersonMessage

LONG_TEXT_CHARACTERS = 400
SENTENCE_COUNT = 3
SENTENCE_END = ". "
PARAGRAPH_BREAK = "\n\n"
AGENT_MESSAGE_PATTERNS: tuple[tuple[re.Pattern[str], MessageTemplate], ...] = (
    (re.compile(r"\[journal\]", re.I), ShopTalkMessage.declared()),
    (re.compile(r"\bthe user\b", re.I), ThirdPersonMessage.declared()),
    (re.compile(r"—.*—", re.S), EmDashMessage.declared()),
)


class ChatMannersLines(EventLineSource):
    """The main agent's newest chat message is read for shop talk, the third person, em dashes and paragraphs
    that run together, and the agent is told of each; each agent message waits ten minutes before it is said again.
    """

    key = "messages.chat-manners"
    events = [HookEventName.POST_TOOL_USE]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, queries: Queries, registry: Registry) -> None:
        self.queries, self.registry = queries, registry

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        newest = self.queries.query(Message).filter(type=MessageType.AGENT).newest().first()
        if newest is None:
            return []
        text = newest.text.strip()
        declarations = [declaration for pattern, declaration in AGENT_MESSAGE_PATTERNS if pattern.search(text)]
        if self.has_journal_command(text) and ShopTalkMessage.declared() not in declarations:
            declarations.append(ShopTalkMessage.declared())
        if len(text) >= LONG_TEXT_CHARACTERS and PARAGRAPH_BREAK not in text and text.count(SENTENCE_END) >= SENTENCE_COUNT:
            declarations.append(ParagraphMessage.declared())
        return [*(declaration.agent_message() for declaration in declarations)]

    def has_journal_command(self, text: str) -> bool:
        return any(re.search(rf"\bjournal {re.escape(command)}\b", text, re.I) for command in self.registry.subcommands)
