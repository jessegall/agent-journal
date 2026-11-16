from dataclasses import dataclass
from engine.command.command import Command
from engine.driver.agent_message import AgentMessage


@dataclass(frozen=True)
class OrphanedRuns:
    """The runs of one agent found ended or lost: the lines that tell it of the lost ones, and the commands that end
    them."""

    agent_messages: tuple[AgentMessage, ...]
    commands: tuple[Command[object], ...]
