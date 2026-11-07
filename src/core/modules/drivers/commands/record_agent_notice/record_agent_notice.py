from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class RecordAgentNotice(Command[None]):
    """Stores an agent notice for reading by its row number."""

    agent_id: int
    text: str
    source: str
