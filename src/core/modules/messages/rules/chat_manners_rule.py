import re

from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.queries import Queries
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_nudges import PARAGRAPH_NUDGE, EM_DASH_NUDGE, SHOP_TALK_NUDGE, THIRD_PERSON_NUDGE

LONG_TEXT_CHARACTERS = 400
SENTENCE_COUNT = 3
SENTENCE_END = ". "
PARAGRAPH_BREAK = "\n\n"
NUDGE_PATTERNS: tuple[tuple[re.Pattern[str], NudgeDeclaration], ...] = (
    (re.compile(r"\bjournal (task|plan|message|question|memory|rule|reminder|sequence|worker|check|skill) [a-z]+\b|\[journal\]", re.I), SHOP_TALK_NUDGE),
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

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        rows = self.queries.query(Message).filter(environment_id=hook.environment_id, type=MessageType.AGENT).newest().page(1, 1).rows
        if not rows:
            return RuleAnswer.allowed()
        text = rows[0].text.strip()
        declarations = [declaration for pattern, declaration in NUDGE_PATTERNS if pattern.search(text)]
        if len(text) >= LONG_TEXT_CHARACTERS and PARAGRAPH_BREAK not in text and text.count(SENTENCE_END) >= SENTENCE_COUNT:
            declarations.append(PARAGRAPH_NUDGE)
        return RuleAnswer.with_nudges(*(declaration.nudge() for declaration in declarations))
