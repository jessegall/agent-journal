from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.documents.commands.keep_revision import KeepRevision
from core.modules.documents.models.doc_revision import DocRevision


class KeepRevisionSubcommand(Subcommand[KeepRevision, DocRevision]):
    """`journal doc keep <n>`: keeps the open revision as it is; the next edit opens a new one."""

    cli_name = "doc"
    name = "keep"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> KeepRevision:
        return KeepRevision(arguments.id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, DocRevision):
            output.line(f"revision {value.number} of doc {value.doc_id} kept; the next edit opens revision {value.number + 1}")
