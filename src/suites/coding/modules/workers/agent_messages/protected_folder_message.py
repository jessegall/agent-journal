from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ProtectedFolderMessage(MessageTemplate):
    """The nudge workers.protected_folder."""

    key = "workers.protected_folder"
    type = AgentMessageType.REFUSAL
    text = "{folder} is protected: report the change to the main agent"
    turn_limited = False
