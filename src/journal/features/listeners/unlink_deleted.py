from journal.events.models.deleted import Deleted
from journal.features.listener import Listener
from journal.repositories.links import Links


class UnlinkDeleted(Listener[Deleted]):
    """A deleted row takes its links with it."""

    def __init__(self, links: Links) -> None: ...

    def handle(self, event: Deleted) -> None: ...
