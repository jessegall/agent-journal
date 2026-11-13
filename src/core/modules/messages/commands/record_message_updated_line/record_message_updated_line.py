from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RecordMessageUpdatedLine(Command[None]):
    """Tells the main agent a user changed a message it has read."""

    message_id: int
