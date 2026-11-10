from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.sharing.commands.accept_share_link.accept_share_link import AcceptShareLink
from core.modules.sharing.commands.support.share_invitation import ShareInvitation


class AcceptShareLinkSubcommand(Subcommand[AcceptShareLink, ShareInvitation]):
    """`journal share accept <id>`: opens the link an agent asked for, and shows its token once."""

    cli_name = "share"
    name = "accept"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("link_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> AcceptShareLink:
        return AcceptShareLink(arguments.link_id)

    def write_output(self, value: object, output: Output) -> None:
        output.row(value)
