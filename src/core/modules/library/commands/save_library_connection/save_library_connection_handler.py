from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.library.commands.save_library_connection.save_library_connection import SaveLibraryConnection
from core.modules.library.models.library_connection import LibraryConnection
from core.modules.library.models.library_copy import LibraryCopy
from core.modules.library.queries.library_connection_query import LibraryConnectionQuery
from core.modules.library.support.library_address import ADDRESS_SETTING
from core.modules.settings.commands.set_setting.set_setting import SetSetting


class SaveLibraryConnectionHandler(Handler[SaveLibraryConnection, LibraryConnection]):
    """Writes the one connection and keeps the address a person typed in the setting; a server that is not the one
    the copies follow is refused while copies exist."""

    command = SaveLibraryConnection

    def __init__(self, connections: LibraryConnectionQuery, queries: Queries, repository: Repository, bus: Bus) -> None:
        self.connections, self.queries, self.repository, self.bus = connections, queries, repository, bus

    def handle(self, command: SaveLibraryConnection, context: Context) -> LibraryConnection:
        existing = self.connections.current()
        values: dict[str, object] = {"server_key": command.server_key, "address": command.address, "name": command.name, "user_name": command.user_name, "role": command.role,
                  "reached_at": context.timestamp, "failure": "", "stopped": ""}
        if existing is not None and existing.server_key != command.server_key:
            self.require_no_copies()
        self.bus.dispatch(SetSetting(ADDRESS_SETTING, command.address_text, True), context)
        if existing is None:
            return self.repository.save(LibraryConnection(creator_id=context.actor.id, server_key=command.server_key, address=command.address, name=command.name, user_name=command.user_name,
                                                          role=command.role, reached_at=context.timestamp, failure="", stopped=""), context)
        return self.repository.save(existing.changed(**values), context)

    def require_no_copies(self) -> None:
        if self.queries.query(LibraryCopy).exists():
            raise Refusal("This address now answers as another server", "journal library disconnect --forget removes the copies of the old one")
