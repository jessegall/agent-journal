from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.sharing.commands.count_share_view.count_share_view import CountShareView
from core.modules.sharing.models.share_link import ShareLink


class CountShareViewSubcommand(Subcommand[CountShareView, ShareLink]):
    """`journal share viewed <token-digest>`: one more view of a link, counted by the viewer's listener."""

    cli_name = "share"
    name = "viewed"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("token_digest")

    def command(self, arguments: Namespace, caller: Caller) -> CountShareView:
        return CountShareView(arguments.token_digest)

    def write_output(self, value: object, output: Output) -> None:
        output.row(value)
