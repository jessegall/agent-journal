from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.developer.support.mark_motion_file import MarkMotionFile


class MarkMotionsSubcommand(ReadSubcommand[str]):
    """`journal developer mark-motions`: the kept recordings of chat marks opening and closing, one JSON line each."""

    cli_name = "developer"
    name = "mark-motions"

    def __init__(self, recordings: MarkMotionFile) -> None:
        self.recordings = recordings

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> str:
        return self.recordings.text()

    def write_output(self, value: object, output: Output) -> None:
        output.write(str(value) or "nothing recorded yet", {"text": value})
