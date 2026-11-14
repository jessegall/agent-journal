from dataclasses import dataclass

from engine.command.command import Command
from core.modules.documents.models.doc_revision import DocRevision


@dataclass(frozen=True)
class KeepRevision(Command[DocRevision]):
    """Saves and closes a document's open revision."""

    doc_id: int
