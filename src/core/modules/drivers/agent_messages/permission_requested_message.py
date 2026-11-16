from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class PermissionRequestedMessage(MessageTemplate):
    """The agent message drivers.permission_asked."""

    key = "drivers.permission_asked"
    type = AgentMessageType.STEERING
    text = "agent {agent} asks permission for one action, request {request}: allow it once or decline it"
    turn_limited = False
    wakes_agent = True
