from journal.chat.docking import Docking
from journal.http.support.model_fields import ModelFields
from journal.http.support.request import Request
from journal.support.response import Response


class DockController:
    """Docks any dockable row above the chat by its table and number, and takes it down again, for its inspector's Dock button."""

    def __init__(self, docking: Docking) -> None:
        self.docking = docking

    def dock(self, request: Request) -> Response:
        row = self.docking.table_row(request.params["table"], request.number("id"))
        return Response.json(ModelFields.build(self.docking.dock_row(row, request.actor)))

    def undock(self, request: Request) -> Response:
        row = self.docking.table_row(request.params["table"], request.number("id"))
        return Response.json(ModelFields.build(self.docking.undock_row(row, request.actor)))
