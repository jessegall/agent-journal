from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class LoadedSkillRefusalMessage(MessageTemplate):
    """The nudge skills.already_loaded."""

    key = "skills.already_loaded"
    type = AgentMessageType.REFUSAL
    text = "The skill {name} is loaded in your context already: use what you read, or skip this refusal if you must read it again"
