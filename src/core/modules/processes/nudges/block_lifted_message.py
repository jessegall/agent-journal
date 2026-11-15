from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class BlockLiftedMessage(MessageTemplate):
    """The nudge processes.block_lifted."""

    key = "processes.block_lifted"
    type = AgentMessageType.STEERING
    text = "A user lifted the block on reader request {request}"
