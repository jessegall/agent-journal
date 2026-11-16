from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class AnnounceAgentRenumber(Command[None]):
    """Tells each running agent its new id after the renumber of agents, and the main agent what it changed, once."""
