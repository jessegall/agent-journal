from engine.command.context import Context
from engine.command.handler import Handler
from tunnels.tunler.commands.logout_tunler.logout_tunler import LogoutTunler
from tunnels.tunler.support.tunler_client import TunlerClient
from tunnels.tunler.support.tunler_person import TunlerPerson


class LogoutTunlerHandler(Handler[LogoutTunler, str]):
    """Asks the tunler program to log out."""

    command = LogoutTunler

    def __init__(self, client: TunlerClient) -> None:
        self.client = client

    def handle(self, command: LogoutTunler, context: Context) -> str:
        TunlerPerson.require(context)
        self.client.logout()
        return "logged out of tunler"
