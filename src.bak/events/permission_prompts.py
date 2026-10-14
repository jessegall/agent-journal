"""What the permission prompts feature recognises in an agent's reports: a permission it waits on, and one it no longer waits on."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class PermissionAsked(Fact):
    """The agent waits for permission to run a tool call, and nothing shows it yet."""

    agent: int
    session: str
    tool: str
    call: str


@dataclass(frozen=True, kw_only=True)
class PermissionAnswered(Fact):
    """The agent no longer waits for the permission this notice showed."""

    notice: int
