from engine.command.context import Context
from engine.command.handler import Handler
from tunnels.tunler.commands.release_tunler_domain.release_tunler_domain import ReleaseTunlerDomain
from tunnels.tunler.support.tunler_client import TunlerClient
from tunnels.tunler.support.tunler_person import TunlerPerson


class ReleaseTunlerDomainHandler(Handler[ReleaseTunlerDomain, str]):
    """Asks the tunler program to release a domain."""

    command = ReleaseTunlerDomain

    def __init__(self, client: TunlerClient) -> None:
        self.client = client

    def handle(self, command: ReleaseTunlerDomain, context: Context) -> str:
        TunlerPerson.require(context)
        self.client.release(command.domain)
        return f"released {command.domain}"
