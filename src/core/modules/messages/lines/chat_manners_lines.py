from collections.abc import Sequence
from engine.driver.nudge import Nudge
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
import re

from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.query.queries import Queries
from engine.registry.registry import Registry
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from core.modules.messages.nudges.paragraph_nudge import ParagraphNudge
from core.modules.messages.nudges.em_dash_nudge import EmDashNudge
from core.modules.messages.nudges.shop_talk_nudge import ShopTalkNudge
from core.modules.messages.nudges.third_person_nudge import ThirdPersonNudge

LONG_TEXT_CHARACTERS = 400
SENTENCE_COUNT = 3
SENTENCE_END = ". "
PARAGRAPH_BREAK = "\n\n"
NUDGE_PATTERNS: tuple[tuple[re.Pattern[str], NudgeDeclaration], ...] = (
    (re.compile(r"\[journal\]", re.I), ShopTalkNudge.declared()),
    (re.compile(r"\bthe user\b", re.I), ThirdPersonNudge.declared()),
    (re.compile(r"—.*—", re.S), EmDashNudge.declared()),
)


class ChatMannersLines(EventLineSource):
    """The main agent's newest chat message is read for shop talk, the third person, em dashes and paragraphs
    that run together, and the agent is told of each; each nudge waits ten minutes before it is said again.
    """

    key = "messages.chat-manners"
    events = [HookEventName.POST_TOOL_USE]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, queries: Queries, registry: Registry) -> None:
        self.queries, self.registry = queries, registry

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        newest = self.queries.query(Message).filter(type=MessageType.AGENT).newest().first()
        if newest is None:
            return []
        text = newest.text.strip()
        declarations = [declaration for pattern, declaration in NUDGE_PATTERNS if pattern.search(text)]
        if self.has_journal_command(text) and ShopTalkNudge.declared() not in declarations:
            declarations.append(ShopTalkNudge.declared())
        if len(text) >= LONG_TEXT_CHARACTERS and PARAGRAPH_BREAK not in text and text.count(SENTENCE_END) >= SENTENCE_COUNT:
            declarations.append(ParagraphNudge.declared())
        return [*(declaration.nudge() for declaration in declarations)]

    def has_journal_command(self, text: str) -> bool:
        return any(re.search(rf"\bjournal {re.escape(command)}\b", text, re.I) for command in self.registry.subcommands)
