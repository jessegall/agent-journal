from core.base.command.context import Context
from core.base.command.handler import Handler
from tunnels.tunler.commands.log_out_tunler.log_out_tunler import LogOutTunler
from tunnels.tunler.support.tunler_client import TunlerClient
from tunnels.tunler.support.tunler_person import TunlerPerson


class LogOutTunlerHandler(Handler[LogOutTunler, str]):
    """Asks the tunler program to log out."""

    command = LogOutTunler
    in_transaction = False

    def __init__(self, client: TunlerClient) -> None:
        self.client = client

    def handle(self, command: LogOutTunler, context: Context) -> str:
        TunlerPerson.require(context)
        self.client.logout()
        return "logged out of tunler"
