from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class HelperInactiveMessage(MessageTemplate):
    """The agent message workers.helper_inactive."""

    key = "workers.helper_inactive"
    type = AgentMessageType.STEERING
    text = "{name}:{agent} used no tool for {minutes} min{queue}: {action}"
    turn_limited = False
    wakes_agent = True
