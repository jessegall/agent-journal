from argparse import ArgumentParser, Namespace
from pathlib import Path

from engine.caller.caller import Caller
from engine.errors.refusal import Refusal
from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome
from engine.map.code_map import CodeMap
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand

PINNED_MAP = Path("tests") / "snapshots" / "map.txt"


class CodeMapSubcommand(ReadSubcommand[str]):
    """`journal map [--write]`: the structure of the code of the checkout the journal runs for, one line for each
    top folder, engine area, module, suite and tunnel. With --write the map is also saved as that checkout's
    tests/snapshots/map.txt, which a test compares."""

    cli_name = "map"
    name = "map"

    def __init__(self, files: FileAccess, home: JournalHome) -> None:
        self.files, self.home = files, home

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--write", action="store_true", help="save the map as tests/snapshots/map.txt")

    def read(self, arguments: Namespace, caller: Caller) -> str:
        checkout = self.home.project_folder
        source = checkout / "src"
        if not source.is_dir():
            raise Refusal(f"{checkout} has no src folder to map", "run journal map in a checkout of the journal's code")
        pinned = checkout / PINNED_MAP
        if arguments.write and not pinned.parent.is_dir():
            raise Refusal(f"{checkout} has no {pinned.parent.relative_to(checkout)} folder to save the map in", "run journal map --write in a checkout of the journal's code")
        text = CodeMap(source, self.files).text()
        if arguments.write:
            self.files.write(pinned, text)
        return text

    def write_output(self, value: object, output: Output) -> None:
        output.write(str(value).rstrip("\n"), {"map": str(value)})
