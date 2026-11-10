from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.processes.commands.make_reader_draft.make_reader_draft import MakeReaderDraft
from core.modules.processes.support.reader_draft import ReaderDraft


class MakeReaderDraftSubcommand(Subcommand[MakeReaderDraft, ReaderDraft]):
    """Shows the draft reader, its sample matches and the command that saves it."""

    cli_name = "reader"
    name = "draft"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("request_id", type=int)
        parser.add_argument("--save", action="store_true")

    def command(self, arguments: Namespace, caller: Caller) -> MakeReaderDraft:
        return MakeReaderDraft(arguments.request_id, arguments.save)

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, ReaderDraft) or output.json_output:
            super().write_output(value, output)
            return
        for line in value.matches:
            output.line(line)
        output.line(value.add_line)

