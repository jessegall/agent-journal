from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.library.queries.library_connection_query import LibraryConnectionQuery
from core.modules.library.support.library_status import LibraryStatus


class LibraryStatusSubcommand(ReadSubcommand[LibraryStatus]):
    """`journal library status`: the address, the server, the user and role, when the server was last reached, the
    last failure and why sync stopped."""

    cli_name = "library"
    name = "status"

    def __init__(self, connections: LibraryConnectionQuery) -> None:
        self.connections = connections

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> LibraryStatus:
        connection = self.connections.current()
        if connection is None:
            return LibraryStatus(False, stopped="This journal is not connected to a shared server.")
        return LibraryStatus(True, connection.address, connection.address.startswith("https://"), connection.name, connection.user_name, connection.role.value,
                             connection.reached_at, connection.failure, connection.stopped)
