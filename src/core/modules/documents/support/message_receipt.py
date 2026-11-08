from dataclasses import dataclass

from core.modules.documents.support.link_page import LinkPage


@dataclass(frozen=True)
class MessageReceipt:
    """The first page of what one message names (its about and edited counterparts) and of the agents it also
    went to."""

    message_id: int
    subject_links: LinkPage
    recipient_links: LinkPage
