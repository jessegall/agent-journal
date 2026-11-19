from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RemoveLink(Command[None]):
    """Corrects one request attribution without changing other relations."""

    lock = True

    link_id: int
