from engine.driver.agent_message import AgentMessage
from dataclasses import dataclass
from engine.command.command import Command


@dataclass(frozen=True)
class UnmergedAnswer:
    """The lines that name each worker whose delivered work waits for a merge, and the commands that close the merge
    holds of workers that no longer wait."""

    agent_messages: tuple[AgentMessage, ...]
    stale: tuple[Command[object], ...]
