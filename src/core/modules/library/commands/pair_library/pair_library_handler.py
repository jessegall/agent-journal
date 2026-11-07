import ssl
import urllib.request
from pathlib import Path

from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.private.secret_values import SecretValues
from core.base.refusal import Refusal
from core.modules.library.commands.pair_library.pair_library import PairLibrary
from core.modules.library.commands.save_library_connection.save_library_connection import SaveLibraryConnection
from core.modules.library.models.library_connection import LibraryConnection
from core.modules.library.support.library_address import ADDRESS_SETTING, LibraryAddress
from core.modules.library.support.library_certificate import LibraryCertificate
from core.modules.library.support.library_client import PROTOCOL, TOKEN_VARIABLE, LibraryClient
from core.modules.library.support.library_failure_error import LibraryFailureError
from core.base.actor_type import ActorType
from core.modules.library.support.library_stopped_error import LibraryStoppedError
from core.modules.library.support.library_unreachable_error import LibraryUnreachableError
from core.modules.library.support.server_info import ServerInfo
from core.modules.library.support.server_user import ServerUser
from core.modules.settings.bindings.support.setting_values import SettingValues


class PairLibraryHandler(Handler[PairLibrary, LibraryConnection]):
    """Asks the server at the typed address who the token belongs to, then keeps the token in the private folder and
    writes the connection; only a person connects, and nothing is sent before that is checked."""

    command = PairLibrary

    def __init__(self, client: LibraryClient, certificate: LibraryCertificate, values: SecretValues, settings: SettingValues, bus: Bus) -> None:
        self.client, self.certificate, self.values, self.settings, self.bus = client, certificate, values, settings, bus

    def handle(self, command: PairLibrary, context: Context) -> LibraryConnection:
        if context.actor.type is not ActorType.USER:
            raise Refusal("connection credentials are entered by a person in the Teams window")
        address_text = command.address or str(self.settings.project_value(ADDRESS_SETTING))
        address = LibraryAddress(address_text).base
        server, user = self.verified(address, command.token, self.opener(command.certificate))
        connection = self.bus.run(SaveLibraryConnection(address_text, address, server.server_key, server.name, user.name, user.role), context.actor)
        self.values.put(TOKEN_VARIABLE, command.token, True, int(context.timestamp.value.timestamp()))
        self.keep_certificate(command.certificate)
        return connection

    def verified(self, address: str, token: str, opener: urllib.request.OpenerDirector) -> tuple[ServerInfo, ServerUser]:
        try:
            server = self.client.call(address, token, ServerInfo.parsed, "GET", "/info", opener=opener)
            if server.protocol != PROTOCOL:
                raise Refusal(f"This server speaks protocol {server.protocol}, this journal {PROTOCOL}", "update the one that is behind, the journal or the server")
            return server, self.client.call(address, token, ServerUser.parsed, "GET", "/me", opener=opener)
        except LibraryStoppedError as stopped:
            raise Refusal("The server did not accept this token.", stopped.suggestion or stopped.reason) from stopped
        except LibraryUnreachableError as unreachable:
            raise Refusal(f"The server could not be reached at {address}.", unreachable.reason) from unreachable
        except LibraryFailureError as failure:
            raise Refusal(f"The server at {address} refused the connection: {failure.reason}", failure.suggestion) from failure

    def keep_certificate(self, file_name: str) -> None:
        if file_name:
            self.certificate.keep(Path(file_name))
        else:
            self.certificate.remove()

    def opener(self, file_name: str) -> urllib.request.OpenerDirector:
        if not file_name:
            return self.certificate.opener()
        try:
            return self.certificate.trusting(Path(file_name))
        except (OSError, ssl.SSLError) as error:
            raise Refusal(f"{file_name} is no certificate file this journal can read", "give the certificate of the server in PEM form") from error
