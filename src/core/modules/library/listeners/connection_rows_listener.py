from core.base.change.changed import Changed
from core.base.change.deleted import Deleted
from core.base.command.context import Context
from core.base.listener.save_listener import SaveListener
from core.modules.library.models.library_connection import LibraryConnection
from core.modules.library.queries.library_connection_query import LibraryConnectionQuery


class ConnectionRowsListener(SaveListener[Changed[LibraryConnection]]):
    name = "library.connection-rows"

    def __init__(self, connections: LibraryConnectionQuery) -> None:
        self.connections = connections

    def handle(self, event: Changed[LibraryConnection], context: Context) -> None:
        if isinstance(event, Deleted):
            self.connections.remove()
            return
        self.connections.remember(event.row)
