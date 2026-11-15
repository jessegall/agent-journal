from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class DraftReadyMessage(MessageTemplate):
    """The nudge processes.draft_ready."""

    key = "processes.draft_ready"
    type = AgentMessageType.STEERING
    text = "No reader reads {name} yet; a draft fits output {output}: review and save it"
    required_command = "journal reader add {name}"
