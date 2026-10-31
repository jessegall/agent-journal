from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.documents.models.doc_revision import DocRevision


@dataclass(frozen=True)
class KeepRevision(Command[DocRevision]):
    """Closes a document's open revision, so its next edit opens a new one."""

    doc_id: int
