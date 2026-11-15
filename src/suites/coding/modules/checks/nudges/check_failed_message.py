from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class CheckFailedMessage(MessageTemplate):
    """The nudge checks.check_failed."""

    key = "checks.check_failed"
    type = AgentMessageType.NOTICE
    text = 'check:{check} failed'
    turn_limited = False
