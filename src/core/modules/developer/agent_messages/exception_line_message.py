from engine.enums.line_delivery import LineDelivery
from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ExceptionLineMessage(MessageTemplate):
    """The agent message developer.exception."""

    key = "developer.exception"
    delivery = LineDelivery.WAKE_HOOK
    type = AgentMessageType.STEERING
    text = "journal-exception:{exception} was recorded: read it, then fix or report the cause"
    turn_limited = False
    wakes_agent = True
    plural_text = "journal-exceptions {exception} were recorded"
    id_field = "exception"
