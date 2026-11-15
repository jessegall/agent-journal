from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class AgentStartFailedMessage(MessageTemplate):
    """The agent message agents.start_failed."""

    key = "agents.start_failed"
    type = AgentMessageType.STEERING
    text = "agent:{agent} failed to start: check its error, then retry or report it"
    wakes_agent = True
