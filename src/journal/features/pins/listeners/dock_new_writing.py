from journal.chat.docking import Docking
from journal.events.listener import Listener
from journal.events.models.created import Created
from journal.models.doc import Doc
from journal.models.report import Report


class DockNewWriting(Listener[Created]):
    """A document or report, once created, is docked at the bottom of the chat, so the user can open it whenever."""

    def __init__(self, docking: Docking) -> None:
        self.docking = docking

    def handle(self, event: Created) -> None:
        if isinstance(event.model, (Doc, Report)):
            self.docking.dock_row(event.model, event.actor)
