from core.modules.messages.support.message_nudges import UNREAD_MESSAGE_STOP
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.messages.queries.message_query import MessageQuery
from core.base.query.conditions.among import Among
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.models.message import Message


class UnreadMessageStopRule(DriverRule):
    """The main agent's stop is refused while a message of the person is unread, naming the oldest."""

    name = "messages.unread-at-stop"
    hook = HookEventName.STOP
    drivers = ["*"]
    overlay_proof = True
    is_notice = True
    refuses_one_action = "The main agent's stop is refused while a message of the person is unread, naming the oldest"

    def __init__(self, messages: MessageQuery) -> None:
        self.messages = messages

    def answer(self, hook: AgentHook) -> RuleAnswer:
        unread = self.messages.unread(hook.agent_id).oldest().first()
        return RuleAnswer.refused(UNREAD_MESSAGE_STOP.nudge(message=unread.id)) if unread is not None else RuleAnswer.allowed("the agent has no unread user message")
