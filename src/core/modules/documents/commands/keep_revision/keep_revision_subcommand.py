from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.documents.commands.keep_revision.keep_revision import KeepRevision
from core.modules.documents.models.doc_revision import DocRevision


class KeepRevisionSubcommand(Subcommand[KeepRevision, DocRevision]):
    """`journal doc close <n>` saves the author's revision."""

    cli_name = "doc"
    name = "close"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> KeepRevision:
        return KeepRevision(arguments.id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, DocRevision):
            output.line(f"doc {value.doc_id} closed; revision {value.number} saved")
