from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class MainCodeEditRefusalMessage(MessageTemplate):
    """The nudge coding.main_writes_no_code."""

    key = "coding.main_writes_no_code"
    type = AgentMessageType.REFUSAL
    text = "The main agent writes no code here: send the work to a worker"
