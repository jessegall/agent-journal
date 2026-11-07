from core.base.command.context import Context
from core.base.command.handler import Handler
from tunnels.tunler.commands.update_tunler.update_tunler import UpdateTunler
from tunnels.tunler.support.tunler_client import TunlerClient
from tunnels.tunler.support.tunler_person import TunlerPerson


class UpdateTunlerHandler(Handler[UpdateTunler, str]):
    """Asks the tunler program to update itself."""

    command = UpdateTunler

    def __init__(self, client: TunlerClient) -> None:
        self.client = client

    def handle(self, command: UpdateTunler, context: Context) -> str:
        TunlerPerson.require(context)
        return self.client.update()
