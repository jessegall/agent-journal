from engine.command.context import Context
from engine.command.handler import Handler
from engine.private.secret_values import SecretValues
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.library.commands.unpair_library.unpair_library import UnpairLibrary
from core.modules.library.models.library_connection import LibraryConnection
from core.modules.library.models.library_copy import LibraryCopy
from core.modules.library.queries.library_connection_query import LibraryConnectionQuery
from core.modules.library.support.library_certificate import LibraryCertificate
from core.modules.library.support.library_client import TOKEN_VARIABLE
from core.modules.library.support.library_disconnection import LibraryDisconnection
from core.modules.library.support.library_person import LibraryPerson
from core.modules.library.errors.library_stopped_error import LibraryStoppedError

UNPAIRED_REASON = "unpairing the library deletes every copy taken from it"

STOPPED_TEXT = "Disconnected. Connect again to sync."


class UnpairLibraryHandler(Handler[UnpairLibrary, LibraryDisconnection]):
    """Removes the token and the kept certificate, then either stops sync with the copies left to wait, or
    deletes the copies and the connection; only a user disconnects."""

    command = UnpairLibrary
    runs_once = True

    def __init__(self, connections: LibraryConnectionQuery, queries: Queries, repository: Repository, values: SecretValues, certificate: LibraryCertificate) -> None:
        self.connections, self.queries, self.repository, self.values, self.certificate = connections, queries, repository, values, certificate

    def handle(self, command: UnpairLibrary, context: Context) -> LibraryDisconnection:
        LibraryPerson.require(context, "only a user connects to the shared server or disconnects from it")
        connection = self.connections.current()
        if connection is None:
            raise LibraryStoppedError.disconnected()
        self.values.retire(TOKEN_VARIABLE, int(context.timestamp.value.timestamp()))
        self.certificate.remove()
        return self.deleted(connection, context) if command.include_copies else self.stopped(connection, context)

    def stopped(self, connection: LibraryConnection, context: Context) -> LibraryDisconnection:
        self.repository.save(connection.changed(stopped=STOPPED_TEXT), context)
        return LibraryDisconnection(self.queries.query(LibraryCopy).count(), False)

    def deleted(self, connection: LibraryConnection, context: Context) -> LibraryDisconnection:
        copies = list(self.queries.query(LibraryCopy).every_row(UNPAIRED_REASON))
        for copy in copies:
            self.repository.delete(copy, context)
        self.repository.delete(connection, context)
        return LibraryDisconnection(len(copies), True)
