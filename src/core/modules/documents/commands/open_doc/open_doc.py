from dataclasses import dataclass

from engine.command.command import Command
from core.modules.documents.models.open_document import OpenDocument


@dataclass(frozen=True)
class OpenDoc(Command[OpenDocument]):
    """Opens a document for one author's revision."""

    doc_id: int
