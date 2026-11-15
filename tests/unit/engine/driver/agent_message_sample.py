from engine.driver.agent_message import AgentMessage
from engine.enums.agent_message_type import AgentMessageType


def sample_agent_message(text: str, type: AgentMessageType = AgentMessageType.STEERING) -> AgentMessage:
    return AgentMessage("sample.line", type, text, turn_limited=False)
