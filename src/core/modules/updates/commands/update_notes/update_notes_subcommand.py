from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.updates.support.release_note_page import ReleaseNotePage
from core.modules.updates.support.release_notes import ReleaseNotes


class UpdateNotesSubcommand(ReadSubcommand[ReleaseNotePage]):
    """`journal update notes --page <n>`: what the published releases say changed, newest first."""

    cli_name = "update"
    name = "notes"

    def __init__(self, notes: ReleaseNotes) -> None:
        self.notes = notes

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--page", type=int, default=1)

    def read(self, arguments: Namespace, caller: Caller) -> ReleaseNotePage:
        return self.notes.page(arguments.page)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, ReleaseNotePage):
            output.write("\n\n".join(f"{note.tag}\n{note.text}" for note in value.notes) or "no release notes", value.json())
