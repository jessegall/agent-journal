
from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.driver.interval import Interval
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan
from core.modules.messages.support.message_nudges import UNANSWERED_COUNTDOWN, UNANSWERED_TOOL_USES
from core.modules.messages.nudges.unanswered_refusal_nudge import UnansweredRefusalNudge
from core.modules.messages.support.unanswered_messages import UnansweredMessages
from core.modules.messages.support.block_conditions.messages_answered import MessagesAnswered

# a read ordered by the time a message was read searches the read index, where a walk by id would read the whole chat



from core.modules.messages.lines.unanswered_message_lines import UnansweredMessageLines
from core.modules.messages.needs.unanswered_message_needs import UNANSWERED_RULE


class UnansweredMessageRule(DriverRule):
    """The old walk's answer for UnansweredMessageLines and UnansweredMessageNeeds, which own it, with the hold the
    walk opens, until the walk is deleted."""

    name = UNANSWERED_RULE
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.HELPER]

    def __init__(self, unanswered: UnansweredMessages, lines: UnansweredMessageLines) -> None:
        self.unanswered_messages, self.lines = unanswered, lines

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudges = self.lines.nudges(hook.event, hook.agent_id)
        if not nudges:
            return RuleAnswer.allowed()
        unanswered = self.unanswered_messages.unanswered(hook.agent_id)
        message_numbers = ", ".join(str(message.id) for message in unanswered)
        return RuleAnswer.with_nudges(*nudges).blocking_after(hook, UnansweredRefusalNudge.declared().nudge(messages=message_numbers, message=unanswered[0].id),
                                                              MessagesAnswered([message.id for message in unanswered]), Interval(ToolUseSpan(UNANSWERED_TOOL_USES)),
                                                              UNANSWERED_COUNTDOWN.nudge("{left}", messages=message_numbers))
