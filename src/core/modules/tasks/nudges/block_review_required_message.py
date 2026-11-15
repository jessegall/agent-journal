from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class BlockReviewRequiredMessage(MessageTemplate):
    """The nudge tasks.block_review_hold."""

    key = "tasks.block_review_hold"
    type = AgentMessageType.REFUSAL
    text = "Review blocked tasks {tasks}: act on each, or skip block {block} with a reason"
