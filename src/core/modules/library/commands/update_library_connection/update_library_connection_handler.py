from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.library.commands.update_library_connection.update_library_connection import UpdateLibraryConnection
from core.modules.library.models.library_connection import LibraryConnection
from core.modules.library.queries.library_connection_query import LibraryConnectionQuery
from core.modules.library.support.library_stopped_error import LibraryStoppedError


class UpdateLibraryConnectionHandler(Handler[UpdateLibraryConnection, LibraryConnection]):
    """Writes the result of a round on the one connection."""

    command = UpdateLibraryConnection

    def __init__(self, connections: LibraryConnectionQuery, repository: Repository) -> None:
        self.connections, self.repository = connections, repository

    def handle(self, command: UpdateLibraryConnection, context: Context) -> LibraryConnection:
        connection = self.connections.current()
        if connection is None:
            raise LibraryStoppedError.disconnected()
        reached = {"reached_at": context.timestamp} if command.has_reached else {}
        return self.repository.update(connection, context, role=command.role, failure=command.failure, stopped=command.stopped, **reached)
