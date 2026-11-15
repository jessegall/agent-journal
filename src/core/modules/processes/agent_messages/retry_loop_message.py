from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class RetryLoopMessage(MessageTemplate):
    """The agent message processes.retry_loop."""

    key = "processes.retry_loop"
    type = AgentMessageType.REFUSAL
    text = "No retry loops: run the command once and read its error"
