from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ReadCommandSkillFirstMessage(MessageTemplate):
    """The agent message skills.read_command_skill_first."""

    key = "skills.read_command_skill_first"
    type = AgentMessageType.REFUSAL
    text = "This command needs a skill you have not read: {instruction}"
    path_fields = ["instruction"]
