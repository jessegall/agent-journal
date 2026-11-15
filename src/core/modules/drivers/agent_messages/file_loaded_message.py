from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class FileLoadedMessage(MessageTemplate):
    """The agent message drivers.file-in-context."""

    key = "drivers.file-in-context"
    type = AgentMessageType.NOTICE
    text = "{path} is unchanged since you read it: use what is in your context"
    path_fields = tuple(["path"])
