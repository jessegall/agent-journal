from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class RunCheckMessage(MessageTemplate):
    """The agent message processes.look_at_run."""

    key = "processes.look_at_run"
    type = AgentMessageType.STEERING
    text = "Output {output} printed nothing for {seconds}s but uses CPU: read it, and stop it if it hangs"
    wakes_agent = True
