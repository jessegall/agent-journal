from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class TriggerLineMessage(MessageTemplate):
    """The nudge triggers.trigger_line."""

    key = "triggers.trigger_line"
    type = AgentMessageType.NOTICE
    text = "trigger:{trigger} fired"
    turn_limited = False
    plural_text = "triggers {trigger} fired"
    id_field = "trigger"
