from core.base.command.context import Context
from core.base.command.handler import Handler
from tunnels.tunler.commands.login_tunler.login_tunler import LoginTunler
from tunnels.tunler.support.tunler_client import TunlerClient
from tunnels.tunler.support.tunler_login import TunlerLogin
from tunnels.tunler.support.tunler_person import TunlerPerson


class LoginTunlerHandler(Handler[LoginTunler, TunlerLogin]):
    """Asks the tunler program to log in."""

    command = LoginTunler

    def __init__(self, client: TunlerClient) -> None:
        self.client = client

    def handle(self, command: LoginTunler, context: Context) -> TunlerLogin:
        TunlerPerson.require(context)
        return self.client.login(command.host, command.username, command.password, command.master)
