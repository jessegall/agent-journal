from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.notices.commands.make_notice import MakeNotice
from core.modules.notices.models.notice import Notice


class MakeNoticeSubcommand(Subcommand[MakeNotice, Notice]):
    """`journal notice make <title> --link <address or row> [--label <button words>]`."""

    cli_name = "notice"
    name = "make"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("title")
        parser.add_argument("--link", required=True)
        parser.add_argument("--label", default="Open")

    def command(self, arguments: Namespace, caller: Caller) -> MakeNotice:
        return MakeNotice(arguments.title, arguments.link, arguments.label)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Notice):
            output.line(f"notice {value.id} pinned: {value.title} -> {value.link}")
