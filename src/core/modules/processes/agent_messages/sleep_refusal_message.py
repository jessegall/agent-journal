from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SleepRefusalMessage(MessageTemplate):
    """The agent message processes.sleep_refused."""

    key = "processes.sleep_refused"
    type = AgentMessageType.REFUSAL
    text = "No sleeps: you are told when a run ends"
