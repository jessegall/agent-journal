from dataclasses import dataclass
from engine.driver.agent_message import AgentMessage
from core.modules.messages.commands.send_message.send_message import SendMessage


@dataclass(frozen=True)
class AgentTextShown:
    """What a finished text block of the agent gives: a line about it, and the chat message it becomes."""

    agent_message: AgentMessage | None
    message: SendMessage | None
