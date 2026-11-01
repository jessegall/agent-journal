from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.base.journal_home import JournalHome
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.messages.commands.record_message_delivery.record_message_delivery import RecordMessageDelivery
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message


class MessageDeliveryRule(DriverRule):
    """On a hook that takes lines, the main agent is told, once, the number of each message the person wrote in its
    environment and how to read it, as version 4 did, with the path of each file it came with; the text stays out, and
    only reading it marks it read."""

    name = "messages.delivery"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries, home: JournalHome) -> None:
        self.queries, self.home = queries, home

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if not hook.event.accepts_lines:
            return RuleAnswer.allowed()
        untold = self.queries.query(Message).filter(environment_id=hook.environment_id, type=MessageType.USER).matching(IsNull("read_at")).matching(IsNull("told_at")).oldest()
        messages = list(untold.all_rows())
        if not messages:
            return RuleAnswer.allowed()
        return RuleAnswer.with_lines(*(line for message in messages for line in self.lines(message))).running(*(RecordMessageDelivery(message.id) for message in messages))

    def lines(self, message: Message) -> list[str]:
        files = [f"  file {self.home.message_files(message.id) / name}" for name in message.files]
        return [f"[journal] new message {message.id}: journal message show {message.id}", *files]
