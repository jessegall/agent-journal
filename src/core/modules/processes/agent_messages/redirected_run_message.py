from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class RedirectedRunMessage(MessageTemplate):
    """The agent message processes.redirected_run."""

    key = "processes.redirected_run"
    type = AgentMessageType.STEERING
    text = "{programs} is redirected to a file, so no reader sees it: run it without the redirect and read it by output number"
