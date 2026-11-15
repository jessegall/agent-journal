from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class IntroductionMessage(MessageTemplate):
    """The nudge coding.introduce_yourself."""

    key = "coding.introduce_yourself"
    type = AgentMessageType.STEERING
    text = "Introduce yourself in the chat in one or two lines, then ask what to do unless the user already asked"
