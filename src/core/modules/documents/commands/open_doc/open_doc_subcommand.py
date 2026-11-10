from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.documents.commands.open_doc.open_doc import OpenDoc
from core.modules.documents.models.open_document import OpenDocument


class OpenDocSubcommand(Subcommand[OpenDoc, OpenDocument]):
    """`journal doc open <n>`."""

    cli_name = "doc"
    name = "open"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> OpenDoc:
        return OpenDoc(arguments.id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, OpenDocument):
            output.line(f"doc {value.doc_id} open; journal doc close {value.doc_id} saves the revision")
