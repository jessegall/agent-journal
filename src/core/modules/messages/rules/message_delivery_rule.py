from core.base.driver.nudge import Nudge
from core.modules.messages.support.message_nudges import MESSAGE_FILE, NEW_MESSAGE, NEW_MESSAGES
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.messages.commands.record_message_delivery.record_message_delivery import RecordMessageDelivery
from core.base.query.conditions.among import Among
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.models.message import Message
from core.modules.messages.support.waiting_message_lines import WAITING_MESSAGE_SOURCE

LISTED_MESSAGES = 5


class MessageDeliveryRule(DriverRule):
    """Delivers each person's message to its target agent, at most five per hook."""

    name = "messages.delivery"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    overlay_proof = True
    is_notice = True

    def __init__(self, queries: Queries, messages: MessageQuery) -> None:
        self.queries, self.messages = queries, messages

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if not hook.event.accepts_lines or hook.event.event == HookEventName.TICK:
            return RuleAnswer.allowed()
        undelivered = sorted(self.messages.unread(hook.agent_id).matching(IsNull("delivered_at")).all_rows(), key=lambda message: message.id)
        messages, waiting = undelivered[:LISTED_MESSAGES], len(undelivered)
        if not messages or self.queries.query(AgentLine).filter(session_agent_id=hook.agent_id, source=WAITING_MESSAGE_SOURCE, state=AgentLineState.TYPING).exists():
            return RuleAnswer.allowed()
        heading = NEW_MESSAGE.nudge(message=messages[0].id) if waiting == 1 else NEW_MESSAGES.nudge(count=waiting)
        return RuleAnswer.with_nudges(heading, *(nudge for message in messages for nudge in self.file_nudges(message))).running(*(RecordMessageDelivery(message.id) for message in messages))

    def file_nudges(self, message: Message) -> list[Nudge]:
        return [MESSAGE_FILE.nudge(message=message.id, name=name) for name in message.files]
