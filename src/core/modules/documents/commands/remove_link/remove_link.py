from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class RemoveLink(Command[None]):
    """Corrects one request attribution without changing other relations."""

    link_id: int
