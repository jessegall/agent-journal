from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SilentStartReadyMessage(MessageTemplate):
    """The nudge processes.silent_start_ready."""

    key = "processes.silent_start_ready"
    type = AgentMessageType.NOTICE
    text = "A reader for {name} fits shape {shape}: {reader}"
    path_fields = tuple(["reader"])
