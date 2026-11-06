from dataclasses import dataclass

from core.modules.documents.support.link_read import LinkRead
from core.modules.documents.support.link_counterpart import LinkCounterpart


@dataclass(frozen=True)
class LinkPage:
    """A bounded relation or counterpart page with an exact continuation command."""

    rows: tuple[LinkRead, ...]
    counterparts: tuple[LinkCounterpart, ...]
    page: int
    page_size: int
    total: int
    next_command: str | None
