from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WeighFirstMessage(MessageTemplate):
    """The nudge memories.weigh_first."""

    key = "memories.weigh_first"
    type = AgentMessageType.REFUSAL
    text = "Weigh your memories first, or skip the weighing with a reason"
