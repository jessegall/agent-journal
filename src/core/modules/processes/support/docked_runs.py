from engine.driver.agent_message import AgentMessage
from dataclasses import dataclass
from engine.command.command import Command


@dataclass(frozen=True)
class DockedRuns:
    """The lines asking a name for each docked run that has none, and the commands that dock the runs now due."""

    agent_messages: tuple[AgentMessage, ...]
    commands: tuple[Command[object], ...]
    # the docked runs, those docked now among them, whose output has no descriptive title
    untitled: tuple[int, ...] = ()
