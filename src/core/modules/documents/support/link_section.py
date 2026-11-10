from dataclasses import dataclass

from engine.row.page import Page
from core.modules.documents.conditions.link_scope import LinkScope
from core.modules.documents.models.link import Link
from core.modules.documents.references.row_ref import RowRef


@dataclass(frozen=True)
class LinkSection:
    """The links one page of `journal link list` shows, read before the rows they point at."""

    links: tuple[Link, ...]
    counterparts: tuple[RowRef, ...]
    scope: LinkScope
    page: Page[Link]
    reference: RowRef
    side: str
    size: int
    types: tuple[str, ...]
    target_model_name: str
    target_counts: dict[str, int]
    grouped: bool
    first_counterpart: str | None
    excludes_plan: bool
    page_number: int

    @property
    def endpoint_references(self) -> set[RowRef]:
        return {end for link in self.links for end in (RowRef(link.source_model, link.source_id), RowRef(link.target_model, link.target_id))}
