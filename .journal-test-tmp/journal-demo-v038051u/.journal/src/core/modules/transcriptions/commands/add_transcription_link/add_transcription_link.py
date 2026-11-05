from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.documents.models.link import Link


@dataclass(frozen=True)
class AddTranscriptionLink(Command[Link]):
    """Links a row made from a transcription back to it."""

    transcription_id: int
    target_model: str
    target_id: int
