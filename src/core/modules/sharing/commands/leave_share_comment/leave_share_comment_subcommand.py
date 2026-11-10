from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.sharing.commands.leave_share_comment.leave_share_comment import LeaveShareComment
from core.modules.sharing.models.share_comment import ShareComment


class LeaveShareCommentSubcommand(Subcommand[LeaveShareComment, ShareComment]):
    """`journal share comment <id> --name <name> --text <text>`: a visitor's comment, brought in by the
    viewer's listener."""

    cli_name = "share"
    name = "comment"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("link_id", type=int)
        parser.add_argument("--name", required=True)
        parser.add_argument("--text", required=True)

    def command(self, arguments: Namespace, caller: Caller) -> LeaveShareComment:
        return LeaveShareComment(arguments.link_id, arguments.name, arguments.text)

    def write_output(self, value: object, output: Output) -> None:
        output.row(value)
