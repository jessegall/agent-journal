import re

from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.among import Among
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.messages.commands.read_message.read_message import ReadMessage
from core.modules.messages.models.message import Message

MESSAGE_READ_LINE = re.compile(r"\bjournal message show (\d+)")


class MessageShowReadRule(DriverRule):
    """A message the main agent has shown with journal message show is marked read; the tool's line
    holds the command inside the runner's own line by then, so the rule looks for it in the text."""

    name = "messages.shown-is-read"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        numbers = tuple(int(number) for number in MESSAGE_READ_LINE.findall(shell.line)) if shell is not None else ()
        unread = self.queries.query(Message).matching(IsNull("read_at")).matching(Among("id", numbers)).all_rows() if numbers else ()
        return RuleAnswer.allowed().running(*(ReadMessage(message.id) for message in unread))
