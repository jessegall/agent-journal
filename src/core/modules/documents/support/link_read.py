from dataclasses import dataclass

from core.modules.documents.models.link import Link
from core.modules.documents.support.link_endpoint import LinkEndpoint


@dataclass(frozen=True)
class LinkRead:
    """One relation with both resolved endpoints and its original stored identity."""

    link: Link
    source: LinkEndpoint
    target: LinkEndpoint
