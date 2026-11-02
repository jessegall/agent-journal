import re

from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.among import Among
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.models.message import Message
from core.modules.messages.rules.message_read_rule import COMMAND_START
from core.modules.messages.support.message_nudges import UNREAD_DISPLAY_REFUSAL

DISPLAY_COMMAND_PATTERN = re.compile(COMMAND_START + r"journal message show (\d+)")


class UnreadMessageShowRule(DriverRule):
    """The main agent reads a person's unread message with journal message read: showing it is refused."""

    name = "messages.unread-show"
    unsilenced = True
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        numbers = tuple(int(number) for number in DISPLAY_COMMAND_PATTERN.findall(shell.line)) if shell is not None else ()
        if not numbers:
            return RuleAnswer.allowed()
        unread = self.queries.query(Message).matching(Among("id", numbers)).matching(Among("type", PERSON_MESSAGE_TYPES)).matching(IsNull("read_at")).oldest().page(1, 1).rows
        return RuleAnswer.refused(UNREAD_DISPLAY_REFUSAL.nudge(message=unread[0].id)) if unread else RuleAnswer.allowed()
