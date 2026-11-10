from engine.command.context import Context
from engine.enums.actor_type import ActorType
from engine.errors.refusal import Refusal
from engine.command.handler import Handler
from tunnels.tunler.commands.login_tunler.login_tunler import LoginTunler
from tunnels.tunler.support.tunler_client import TunlerClient
from tunnels.tunler.support.tunler_login import TunlerLogin


class LoginTunlerHandler(Handler[LoginTunler, TunlerLogin]):
    """Asks the tunler program to log in."""

    command = LoginTunler

    def __init__(self, client: TunlerClient) -> None:
        self.client = client

    def handle(self, command: LoginTunler, context: Context) -> TunlerLogin:
        if context.actor.type is not ActorType.USER:
            raise Refusal("sign-in credentials are entered by a person in the Tunler window")
        return self.client.login(command.host, command.username, command.password, command.master)
