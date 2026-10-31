from dataclasses import dataclass

from core.base.model.model import Model
from core.modules.documents.models.support.abstract_check import AbstractCheck


@dataclass(frozen=True, kw_only=True)
class Report(Model):
    """A report: what was checked or researched at one time, as a title, a one-line abstract and a text in sections."""

    model_name = "report"
    cli_name = "report"

    environment_id: int | None = None
    creator_id: int
    title: str
    abstract: str
    body: str
    close_reason: str = ""

    def __post_init__(self) -> None:
        AbstractCheck.check(self.title, self.abstract)
