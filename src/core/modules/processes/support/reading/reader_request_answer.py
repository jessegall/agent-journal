from dataclasses import dataclass

from engine.command.command import Command
from engine.driver.agent_message import AgentMessage


from core.modules.processes.support.reading.reader_help_hold import ReaderHelpHold


@dataclass(frozen=True)
class ReaderRequestAnswer:
    """What the open reader requests say at one hook: the lines that ask for a reader or for help, the holds that ask
    the main agent to help with failed or expired requests, and at the tick the notices that tell it of them."""

    agent_messages: tuple[AgentMessage, ...] = ()
    holds: tuple[ReaderHelpHold, ...] = ()
    commands: tuple[Command[object], ...] = ()
