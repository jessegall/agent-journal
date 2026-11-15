from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ReminderBlockMessage(MessageTemplate):
    """The agent message reminders.block."""

    key = "reminders.block"
    type = AgentMessageType.REFUSAL
    text = "reminder:{reminder} is holding you: deal with it first"
    turn_limited = False
