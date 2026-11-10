from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RecordSubjectLink(Command[None]):
    """Links a person's message to a row made or changed in answer to it."""

    message_id: int
    target_model: str
    target_id: int
