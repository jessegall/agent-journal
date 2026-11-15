from dataclasses import dataclass

from engine.command.command import Command
from engine.driver.agent_message import AgentMessage


@dataclass(frozen=True)
class RecordAgentMessage(Command[None]):
    lock = False

    agent_id: int
    nudge: AgentMessage
    source: str
