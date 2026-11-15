from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class HelperLimitWarningMessage(MessageTemplate):
    """The agent message helpers.limit_warning."""

    key = "helpers.limit_warning"
    type = AgentMessageType.STEERING
    text = "agent:{agent} is near its {limit} limit: stop it, or let it run out"
    turn_limited = False
