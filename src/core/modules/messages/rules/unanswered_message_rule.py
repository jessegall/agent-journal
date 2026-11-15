
from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.driver.interval import Interval
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan
from core.modules.messages.support.message_nudges import UNANSWERED_COUNTDOWN, UNANSWERED_TOOL_USES
from core.modules.messages.nudges.unanswered_nudge import UnansweredNudge
from core.modules.messages.nudges.unanswered_refusal_nudge import UnansweredRefusalNudge
from core.modules.messages.support.unanswered_messages import UnansweredMessages
from core.modules.messages.support.block_conditions.messages_answered import MessagesAnswered

# a read ordered by the time a message was read searches the read index, where a walk by id would read the whole chat
OLDEST_PERSON_MESSAGES = 50

NEWEST_AGENT_MESSAGES = 50


class UnansweredMessageRule(DriverRule):
    """A message an agent has read and not answered, whoever sent it but the journal, is named before
    each tool call, and after ten calls tool calls wait for the answer; a journal message line and
    the task a message asks for always go through, since they are the answer; a prompt typed in the
    terminal is answered in the terminal. Only messages read since the agent's current session began
    or since its last message wait on it: earlier sessions handled the older ones. A message from an
    agent that has ended waits on no reply, and of the messages from running agents only the newest
    50 are checked: an unanswered one holds the agent after ten tool calls, so older ones were
    answered. The start of the current session is compared inside the message read, so it costs no
    read of its own."""

    name = "messages.unanswered"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.HELPER]

    def __init__(self, unanswered: UnansweredMessages) -> None:
        self.unanswered_messages = unanswered

    def answer(self, hook: AgentHook) -> RuleAnswer:
        unanswered = self.unanswered_messages.unanswered(hook.agent_id)
        tool = hook.event.tool
        if not unanswered or (tool is not None and tool.shell is not None and tool.shell.parts_running_journal_command("message", "task make")):
            return RuleAnswer.allowed()
        message_numbers = ", ".join(str(message.id) for message in unanswered)
        return RuleAnswer.with_nudges(UnansweredNudge.declared().nudge(messages=message_numbers)).blocking_after(hook, UnansweredRefusalNudge.declared().nudge(messages=message_numbers, message=unanswered[0].id),
                                                                                                  MessagesAnswered([message.id for message in unanswered]), Interval(ToolUseSpan(UNANSWERED_TOOL_USES)),
                                                                                                  UNANSWERED_COUNTDOWN.nudge("{left}", messages=message_numbers))
