from journal.events.listener import Listener
from journal.events.models.synced import Synced
from journal.models.dump import Dump
from journal.models.message import Message
from journal.sync.attachments import Attachments


class PulledFiles(Listener[Synced]):
    """The files a pulled message or dump names are fetched from the team server as it arrives, so an agent that opens one from disk, the way journal message read points to it, finds it there."""

    def __init__(self, attachments: Attachments) -> None:
        self.attachments = attachments

    def handle(self, event: Synced) -> None:
        if isinstance(event.model, (Message, Dump)):
            for name in event.model.files:
                self.attachments.read(event.model.table(), event.model.row_id, name)
