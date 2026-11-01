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
from core.modules.messages.support.message_nudges import BLANK_LINES, NO_EM_DASHES, NO_SHOP_TALK, SAY_YOU

LONG_PARAGRAPH_CHARACTERS = 400
SENTENCE_COUNT = 3
SENTENCE_END = ". "
PARAGRAPH_BREAK = "\n\n"
PATTERNS: tuple[tuple[re.Pattern[str], NudgeDeclaration], ...] = (
    (re.compile(r"\bjournal (task|plan|message|question|memory|rule|reminder|sequence|worker|check|skill) [a-z]+\b|\[journal\]", re.I), NO_SHOP_TALK),
    (re.compile(r"\bthe user\b", re.I), SAY_YOU),
    (re.compile(r"—.*—", re.S), NO_EM_DASHES),
)


class ChatMannersRule(DriverRule):
    """The main agent's newest chat message is read for shop talk, the third person, em dashes and paragraphs that
    run together, and the agent is told of each; each remark waits ten minutes before it is said again."""

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
        remarks = [declaration.nudge() for pattern, declaration in PATTERNS if pattern.search(text)]
        runs_together = len(text) >= LONG_PARAGRAPH_CHARACTERS and PARAGRAPH_BREAK not in text and text.count(SENTENCE_END) >= SENTENCE_COUNT
        return RuleAnswer.with_nudges(*remarks, *((BLANK_LINES.nudge(),) if runs_together else ()))
