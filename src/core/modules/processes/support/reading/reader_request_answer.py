from dataclasses import dataclass

from engine.command.command import Command
from engine.driver.agent_message import AgentMessage
from core.modules.processes.support.block_conditions.reader_request_completed import ReaderRequestCompleted


@dataclass(frozen=True)
class ReaderHelpHold:
    """The hold that asks the main agent to help with one reader request: its line, the request's completion that
    lifts it, and the command the request is for."""

    nudge: AgentMessage
    condition: ReaderRequestCompleted
    command: str


@dataclass(frozen=True)
class ReaderRequestAnswer:
    """What the open reader requests say at one hook: the lines that ask for a reader or for help, the holds that ask
    the main agent to help with failed or expired requests, and at the tick the notices that tell it of them."""

    nudges: tuple[AgentMessage, ...] = ()
    holds: tuple[ReaderHelpHold, ...] = ()
    commands: tuple[Command[object], ...] = ()
