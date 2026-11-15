from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ReminderLineMessage(MessageTemplate):
    """The nudge reminders.line."""

    key = "reminders.line"
    type = AgentMessageType.STEERING
    text = "reminder:{reminder} is due: act on it"
    turn_limited = False
    id_field = "reminder"
    plural_text = "reminders {reminder} are due"
