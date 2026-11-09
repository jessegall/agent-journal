from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.among import Among
from core.base.query.conditions.is_null import IsNull
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_nudges import UNREAD_DISPLAY_REFUSAL


class UnreadMessageShowRule(DriverRule):
    """The main agent reads a person's unread message with journal message read: showing it is refused."""

    name = "messages.unread-show"
    exempt = True
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    refuses_one_action = "Showing a person's unread message is refused: the main agent reads it with journal message read"

    def __init__(self, messages: MessageQuery) -> None:
        self.messages = messages

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        numbers = shell.journal_command_numbers("message show") if shell is not None else ()
        if not numbers:
            return RuleAnswer.allowed()
        unread = self.messages.unread(hook.agent_id).matching(Among("id", numbers)).oldest().first()
        return RuleAnswer.refused(UNREAD_DISPLAY_REFUSAL.nudge(message=unread.id)) if unread is not None else RuleAnswer.allowed()
