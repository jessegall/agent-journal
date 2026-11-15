from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ContextHardStopMessage(MessageTemplate):
    """The agent message workers.context_hard_stop."""

    key = "workers.context_hard_stop"
    type = AgentMessageType.REFUSAL
    text = "Your context passed the second limit: no more tools, stop now; it is being compacted"
    turn_limited = False
