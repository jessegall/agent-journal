from argparse import ArgumentParser, Namespace
from pathlib import Path

from engine.caller.caller import Caller
from engine.file.file_access import FileAccess
from engine.map.code_map import CodeMap
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand

SOURCE_FOLDER = Path(__file__).resolve().parents[5]
PINNED_MAP = SOURCE_FOLDER.parent / "tests" / "snapshots" / "map.txt"


class CodeMapSubcommand(ReadSubcommand[str]):
    """`journal map [--write]`: the structure of the code, one line for each top folder, engine area, module,
    suite and tunnel. With --write the map is also saved as tests/snapshots/map.txt, which a test compares."""

    cli_name = "map"
    name = "map"

    def __init__(self, files: FileAccess) -> None:
        self.files = files

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--write", action="store_true", help="save the map as tests/snapshots/map.txt")

    def read(self, arguments: Namespace, caller: Caller) -> str:
        text = CodeMap(SOURCE_FOLDER, self.files).text()
        if arguments.write:
            self.files.write(PINNED_MAP, text)
        return text

    def write_output(self, value: object, output: Output) -> None:
        output.write(str(value).rstrip("\n"), {"map": str(value)})
