from dataclasses import dataclass

from core.base.model.model import Model
from core.modules.documents.models.support.abstract_check import AbstractCheck


@dataclass(frozen=True, kw_only=True)
class Doc(Model):
    """A document: what the project keeps knowing, as a title, a one-line abstract and a text in sections."""

    model_name = "doc"
    cli_name = "doc"

    environment_id: int | None = None
    creator_id: int
    title: str
    abstract: str
    body: str
    close_reason: str = ""

    def __post_init__(self) -> None:
        AbstractCheck.check(self.title, self.abstract)
