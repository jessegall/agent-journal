from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ReaderDraftMessage(MessageTemplate):
    """The agent message processes.draft_a_reader."""

    key = "processes.draft_a_reader"
    type = AgentMessageType.STEERING
    text = "No reader reads {name} yet: draft one"
    required_command = "journal reader add {name}"
