from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class SendMergerReport(Command[None]):
    """Sends the main agent a line of the merger."""

    text: str
