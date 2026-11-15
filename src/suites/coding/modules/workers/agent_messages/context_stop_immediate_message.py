from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ContextStopImmediateMessage(MessageTemplate):
    """The agent message workers.context_stop_now."""

    key = "workers.context_stop_now"
    type = AgentMessageType.STEERING
    text = "Your context passed the limit and you hold no task: stop now; stopping compacts it"
    turn_limited = False
