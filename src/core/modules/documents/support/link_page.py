from dataclasses import dataclass

from core.modules.documents.models.link import Link
from core.modules.documents.support.link_endpoint import LinkEndpoint


@dataclass(frozen=True)
class LinkRead:
    """One relation with both resolved endpoints and its original stored identity."""

    link: Link
    source: LinkEndpoint
    target: LinkEndpoint


@dataclass(frozen=True)
class LinkCounterpart:
    """One counterpart with every matching relation label and stored relation number."""

    endpoint: LinkEndpoint
    relations: tuple[str, ...]
    link_ids: tuple[int, ...]


@dataclass(frozen=True)
class LinkPage:
    """A bounded relation or counterpart page with an exact continuation command."""

    rows: tuple[LinkRead, ...]
    counterparts: tuple[LinkCounterpart, ...]
    page: int
    page_size: int
    total: int
    next_command: str | None
