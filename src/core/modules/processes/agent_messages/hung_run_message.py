from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class HungRunMessage(MessageTemplate):
    """The agent message processes.hung_run."""

    key = "processes.hung_run"
    type = AgentMessageType.STEERING
    text = "Output {output} printed nothing for {seconds}s and was stopped: its output is kept"
    wakes_agent = True
