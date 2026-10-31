from dataclasses import dataclass

from core.modules.documents.models.doc_revision import DocRevision


@dataclass(frozen=True)
class RevisionReading:
    """One revision of a document with how many revisions the document has."""

    revision: DocRevision
    count: int
