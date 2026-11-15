from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SmallBatchMessage(MessageTemplate):
    """The agent message workers.small_batch."""

    key = "workers.small_batch"
    type = AgentMessageType.STEERING
    text = "Batch of {count}: queue more tasks per worker; a long batch interrupts you less"
    turn_limited = False
