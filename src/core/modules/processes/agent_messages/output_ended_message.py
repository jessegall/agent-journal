from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class OutputEndedMessage(MessageTemplate):
    """The agent message processes.output_ended."""

    key = "processes.output_ended"
    type = AgentMessageType.STEERING
    text = "Output {output} ended"
    turn_limited = False
    wakes_agent = True
