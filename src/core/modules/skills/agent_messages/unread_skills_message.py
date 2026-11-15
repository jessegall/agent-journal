from engine.driver.agent_message import AgentMessage
from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UnreadSkillsMessage(MessageTemplate):
    """The nudge skills.unread_skills."""

    key = "skills.unread_skills"
    type = AgentMessageType.REFUSAL
    text = "Unread skills: {skills}: read them first"

    # the line that names every unread skill
    @classmethod
    def naming(cls, skills: list[str]) -> AgentMessage:
        return cls.declared().agent_message(skills=", ".join(skills))
