from engine.driver.agent_message import AgentMessage
from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ReadSkillFirstMessage(MessageTemplate):
    """The nudge skills.read_skill_first."""

    key = "skills.read_skill_first"
    type = AgentMessageType.REFUSAL
    text = "A skill is unread: {instruction}"
    path_fields = ["instruction"]

    # the line that names how to read the skill
    @classmethod
    def instructed(cls, instruction: str) -> AgentMessage:
        return cls.declared().agent_message(instruction=instruction)
