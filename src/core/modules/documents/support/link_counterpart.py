from dataclasses import dataclass

from core.modules.documents.support.link_endpoint import LinkEndpoint


@dataclass(frozen=True)
class LinkCounterpart:
    """One counterpart with every matching relation label and stored relation number."""

    endpoint: LinkEndpoint
    relations: tuple[str, ...]
    link_ids: tuple[int, ...]
