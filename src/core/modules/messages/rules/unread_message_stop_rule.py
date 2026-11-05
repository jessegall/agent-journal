from core.modules.messages.support.message_nudges import UNREAD_MESSAGE_STOP
from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.query.conditions.among import Among
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.models.message import Message


class UnreadMessageStopRule(DriverRule):
    """The main agent's stop is refused while a message of the person is unread, naming the oldest."""

    name = "messages.unread-at-stop"
    hook = HookEventName.STOP
    drivers = ["*"]
    roles = [AgentRole.MAIN]
    overlay_proof = True

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        unread = self.queries.query(Message).filter(environment_id=hook.environment_id).matching(Among("type", PERSON_MESSAGE_TYPES)).matching(IsNull("read_at")).oldest().limited(1)
        return RuleAnswer.refused(UNREAD_MESSAGE_STOP.nudge(message=unread[0].id)) if unread else RuleAnswer.allowed()
