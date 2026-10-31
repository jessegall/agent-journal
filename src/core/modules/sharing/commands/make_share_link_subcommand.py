from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.sharing.commands.make_share_link import MakeShareLink
from core.modules.sharing.commands.support.share_invitation import ShareInvitation


class MakeShareLinkSubcommand(Subcommand[MakeShareLink, ShareInvitation]):
    """`journal share make plans:2`: a read-only link to a document, a report or a plan; its token is shown
    once."""

    cli_name = "share"
    name = "make"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("target")

    def command(self, arguments: Namespace, caller: Caller) -> MakeShareLink:
        return MakeShareLink(arguments.target)

    def write_output(self, value: object, output: Output) -> None:
        output.row(value)
