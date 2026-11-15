from dataclasses import dataclass

from engine.command.command import Command
from engine.driver.agent_message import AgentMessage


@dataclass(frozen=True)
class SendMergerReport(Command[None]):
    """Sends the main agent a message of the merger."""

    text: str | AgentMessage
