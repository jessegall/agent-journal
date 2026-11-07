from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class SendReadersNotice(Command[None]):
    """Tells a main agent how many readers lack required fields."""

