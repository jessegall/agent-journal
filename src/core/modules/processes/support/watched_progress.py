from dataclasses import dataclass
from engine.command.command import Command
from engine.driver.agent_message import AgentMessage


@dataclass(frozen=True)
class WatchedProgress:
    """The lines about the runs an agent watches, and the commands that record the percent each line gave."""

    agent_messages: tuple[AgentMessage, ...]
    commands: tuple[Command[object], ...]
