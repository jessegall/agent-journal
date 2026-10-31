from dataclasses import dataclass

from core.base.model.model import Model
from core.modules.documents.models.support.abstract_check import AbstractCheck


@dataclass(frozen=True, kw_only=True)
class TextRow(Model):
    """What a document and a report both are: a title, a one-line abstract and a text in sections, in an
    environment or the whole project, and closed with a reason once it needs no action."""

    environment_id: int | None = None
    creator_id: int
    title: str
    abstract: str
    body: str
    close_reason: str = ""

    def __post_init__(self) -> None:
        AbstractCheck.check(self.title, self.abstract)
