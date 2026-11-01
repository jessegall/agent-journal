from core.base.driver.nudge import Nudge
from core.modules.messages.support.message_nudges import MESSAGE_FILE, NEW_MESSAGE, NEW_MESSAGES
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

LISTED_MESSAGES = 5


class MessageDeliveryRule(DriverRule):
    """On a hook that takes lines, the main agent is told, once, the number of each message the
    person wrote in its environment and how to read it, as version 4 did, with the path of each
    file it came with; the text stays out, and only reading it marks it read. A hook tells of the oldest
    five at most, the rest on the hooks after it, so a long backlog never makes one hook expensive."""

    name = "messages.delivery"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries, home: JournalHome) -> None:
        self.queries, self.home = queries, home

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if not hook.event.accepts_lines:
            return RuleAnswer.allowed()
        undelivered = self.queries.query(Message).filter(environment_id=hook.environment_id, type=MessageType.USER).matching(IsNull("read_at")).matching(IsNull("delivered_at")).oldest()
        page = undelivered.page(1, LISTED_MESSAGES)
        messages, waiting = page.rows, page.total
        if not messages:
            return RuleAnswer.allowed()
        heading = NEW_MESSAGE.nudge(message=messages[0].id) if waiting == 1 else NEW_MESSAGES.nudge(count=waiting)
        return RuleAnswer.with_nudges(heading, *(nudge for message in messages for nudge in self.file_nudges(message))).running(*(RecordMessageDelivery(message.id) for message in messages))

    def file_nudges(self, message: Message) -> list[Nudge]:
        return [MESSAGE_FILE.nudge(path=self.home.message_files(message.id) / name) for name in message.files]
