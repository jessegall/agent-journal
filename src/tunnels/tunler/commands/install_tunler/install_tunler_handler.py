from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from tunnels.tunler.commands.install_tunler.install_tunler import InstallTunler
from tunnels.tunler.support.tunler_client import TunlerClient
from tunnels.tunler.support.tunler_person import TunlerPerson


class InstallTunlerHandler(Handler[InstallTunler, str]):
    """Installs tunler from the server the address names, without its scheme or path."""

    command = InstallTunler

    def __init__(self, client: TunlerClient) -> None:
        self.client = client

    def handle(self, command: InstallTunler, context: Context) -> str:
        TunlerPerson.require(context)
        host = command.server.strip().removeprefix("https://").removeprefix("http://").partition("/")[0]
        if not host:
            raise Refusal("give the address of the tunler server to install from, such as tunler.example.com")
        return self.client.install(host)
