from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.notices.commands.close_notice import CloseNotice
from core.modules.notices.models.notice import Notice


class CloseNoticeSubcommand(Subcommand[CloseNotice, Notice]):
    """`journal notice close <n>`."""

    cli_name = "notice"
    name = "close"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> CloseNotice:
        return CloseNotice(arguments.id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Notice):
            output.line(f"notice {value.id} closed")
