from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from tunnels.tunler.commands.release_tunler_domain.release_tunler_domain import ReleaseTunlerDomain


class ReleaseTunlerDomainSubcommand(Subcommand[ReleaseTunlerDomain, str]):
    """`journal tunler release <domain>`: takes a domain off the logged-in account."""

    cli_name = "tunler"
    name = "release"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("domain")

    def command(self, arguments: Namespace, caller: Caller) -> ReleaseTunlerDomain:
        return ReleaseTunlerDomain(arguments.domain)
