from journal.events.models.deleted import Deleted
from journal.events.listener import Listener
from journal.repositories.links import Links


class UnlinkDeleted(Listener[Deleted]):
    """A deleted row takes its links with it."""

    def __init__(self, links: Links) -> None:
        self.links = links

    def handle(self, event: Deleted) -> None:
        self.links.remove_links(event.model)
