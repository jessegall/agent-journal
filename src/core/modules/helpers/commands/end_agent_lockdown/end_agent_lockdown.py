from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class EndAgentLockdown(Command[None]):
    """Tells an agent that was stopped at its program's usage limit to go on, once."""

    agent_id: int
