from dataclasses import dataclass

from core.base.model.model import Model
from core.base.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class DocRevision(Model):
    """One kept version of a document's text, numbered from 1, with what changed and when it stops taking edits."""

    model_name = "doc_revision"
    cli_name = "doc-revision"

    doc_id: int
    creator_id: int
    number: int
    title: str
    abstract: str
    body: str
    change: str
    closes_at: Timestamp
