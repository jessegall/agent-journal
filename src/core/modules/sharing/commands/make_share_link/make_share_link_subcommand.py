from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.sharing.commands.make_share_link.make_share_link import MakeShareLink
from core.modules.sharing.commands.support.share_invitation import ShareInvitation


class MakeShareLinkSubcommand(Subcommand[MakeShareLink, ShareInvitation]):
    """`journal share make plans:2 [--ends 7d] [--password <it>] [--comments]`: a read-only link to a
    document, a report or a plan, whose token is shown
    once; an agent's only asks a user for one."""

    cli_name = "share"
    name = "make"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("target")
        parser.add_argument("--ends", default="7d")
        parser.add_argument("--password")
        parser.add_argument("--comments", action="store_true")

    def command(self, arguments: Namespace, caller: Caller) -> MakeShareLink:
        return MakeShareLink(arguments.target, arguments.ends, arguments.password, arguments.comments)

    def write_output(self, value: object, output: Output) -> None:
        output.row(value)
