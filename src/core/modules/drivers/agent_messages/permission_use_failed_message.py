from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class PermissionUseFailedMessage(MessageTemplate):
    """The agent message drivers.permission_use_failed."""

    key = "drivers.permission_use_failed"
    type = AgentMessageType.STEERING
    text = "the journal could not mark your allowed request as used, so this action did not run: try it again"
