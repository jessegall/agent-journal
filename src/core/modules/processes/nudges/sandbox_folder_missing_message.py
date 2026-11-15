from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SandboxFolderMissingMessage(MessageTemplate):
    """The nudge processes.sandbox_folder_missing."""

    key = "processes.sandbox_folder_missing"
    type = AgentMessageType.REFUSAL
    text = "The shell sandbox needs a registered folder and this agent has none: restart it through its start command"
