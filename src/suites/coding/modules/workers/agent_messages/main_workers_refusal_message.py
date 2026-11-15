from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class MainWorkersRefusalMessage(MessageTemplate):
    """The agent message workers.main_sends_no_workers."""

    key = "workers.main_sends_no_workers"
    type = AgentMessageType.REFUSAL
    text = "The main agent sends no workers here: {then}"
