from dataclasses import dataclass

from engine.command.command import Command
from engine.driver.agent_message import AgentMessage


@dataclass(frozen=True)
class RecordAgentMessage(Command[None]):
    agent_id: int
    agent_message: AgentMessage
    source: str
