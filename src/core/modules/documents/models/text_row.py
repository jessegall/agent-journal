from dataclasses import dataclass

from engine.model.model import Model
from core.modules.documents.models.support.abstract_check import AbstractCheck


@dataclass(frozen=True, kw_only=True)
class TextRow(Model):
    """A project document or report with a title, abstract, body and optional reason for closing."""

    creator_id: int
    title: str
    abstract: str
    body: str
    close_reason: str = ""

    def __post_init__(self) -> None:
        AbstractCheck.check(self.title, self.abstract)
