from core.base.command.context import Context
from core.base.command.handler import Handler
from tunnels.tunler.commands.log_in_tunler.log_in_tunler import LogInTunler
from tunnels.tunler.support.tunler_client import TunlerClient
from tunnels.tunler.support.tunler_login import TunlerLogin
from tunnels.tunler.support.tunler_person import TunlerPerson


class LogInTunlerHandler(Handler[LogInTunler, TunlerLogin]):
    """Asks the tunler program to log in."""

    command = LogInTunler

    def __init__(self, client: TunlerClient) -> None:
        self.client = client

    def handle(self, command: LogInTunler, context: Context) -> TunlerLogin:
        TunlerPerson.require(context)
        return self.client.login(command.host, command.username, command.password, command.master)
