from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.base.journal_home import JournalHome
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.messages.commands.read_message import ReadMessage
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message


class MessageDeliveryRule(DriverRule):
    """On any hook of the main agent, each message the person wrote in its environment that it has not read is
    given to it, once, with the path of each file it came with, and is marked read."""

    name = "messages.delivery"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries, home: JournalHome) -> None:
        self.queries, self.home = queries, home

    def answer(self, hook: AgentHook) -> RuleAnswer:
        unread = self.queries.query(Message).filter(environment_id=hook.environment_id, type=MessageType.USER).matching(IsNull("read_at")).oldest()
        messages = list(unread.all_rows())
        if not messages:
            return RuleAnswer.allowed()
        return RuleAnswer.with_lines(*(line for message in messages for line in self.lines(message))).running(*(ReadMessage(message.id) for message in messages))

    def lines(self, message: Message) -> list[str]:
        files = [f"  file {self.home.message_files(message.id) / name}" for name in message.files]
        return [f"[journal] new message {message.id}: {message.text}", *files]
