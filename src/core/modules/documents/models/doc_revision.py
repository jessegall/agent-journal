from dataclasses import dataclass

from core.base.model.model import Model
from engine.time.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class DocRevision(Model):
    """A document revision with its author, text, changes and closing timestamp."""

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
    author_id: int | None = None
