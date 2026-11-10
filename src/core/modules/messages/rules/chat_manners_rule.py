import re

from engine.enums.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.rule_answer import RuleAnswer
from engine.query.queries import Queries
from engine.registry.registry import Registry
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_nudges import PARAGRAPH_NUDGE, EM_DASH_NUDGE, SHOP_TALK_NUDGE, THIRD_PERSON_NUDGE

LONG_TEXT_CHARACTERS = 400
SENTENCE_COUNT = 3
SENTENCE_END = ". "
PARAGRAPH_BREAK = "\n\n"
NUDGE_PATTERNS: tuple[tuple[re.Pattern[str], NudgeDeclaration], ...] = (
    (re.compile(r"\[journal\]", re.I), SHOP_TALK_NUDGE),
    (re.compile(r"\bthe user\b", re.I), THIRD_PERSON_NUDGE),
    (re.compile(r"—.*—", re.S), EM_DASH_NUDGE),
)


class ChatMannersRule(DriverRule):
    """The main agent's newest chat message is read for shop talk, the third person, em dashes and paragraphs
    that run together, and the agent is told of each; each nudge waits ten minutes before it is said again.
    """

    name = "messages.chat-manners"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries, registry: Registry) -> None:
        self.queries, self.registry = queries, registry

    def answer(self, hook: AgentHook) -> RuleAnswer:
        newest = self.queries.query(Message).filter(type=MessageType.AGENT).newest().first()
        if newest is None:
            return RuleAnswer.allowed()
        text = newest.text.strip()
        declarations = [declaration for pattern, declaration in NUDGE_PATTERNS if pattern.search(text)]
        if self.has_journal_command(text) and SHOP_TALK_NUDGE not in declarations:
            declarations.append(SHOP_TALK_NUDGE)
        if len(text) >= LONG_TEXT_CHARACTERS and PARAGRAPH_BREAK not in text and text.count(SENTENCE_END) >= SENTENCE_COUNT:
            declarations.append(PARAGRAPH_NUDGE)
        return RuleAnswer.with_nudges(*(declaration.nudge() for declaration in declarations))

    def has_journal_command(self, text: str) -> bool:
        return any(re.search(rf"\bjournal {re.escape(command)}\b", text, re.I) for command in self.registry.subcommands)
