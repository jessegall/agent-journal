from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.library.commands.choose_library_version.choose_library_version import ChooseLibraryVersion
from core.modules.library.models.enums.copy_progress import CopyProgress
from core.modules.library.models.enums.kept_side import KeptSide
from core.modules.library.models.library_copy import LibraryCopy


class ChooseLibraryVersionSubcommand(Subcommand[ChooseLibraryVersion, LibraryCopy]):
    """`journal library resolve <copy> --keep mine|library`: ends a conflict, a refused change or a new version to
    read."""

    cli_name = "library"
    name = "resolve"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("copy_id", metavar="copy", type=int)
        parser.add_argument("--keep", required=True, choices=[side.value for side in KeptSide])

    def command(self, arguments: Namespace, caller: Caller) -> ChooseLibraryVersion:
        return ChooseLibraryVersion(arguments.copy_id, KeptSide(arguments.keep))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, LibraryCopy):
            line = f"{value.share} {value.row_id} follows library {value.share} {value.item_id}, version {value.base_version}. Status: {CopyProgress(value.state.value).label}"
            output.write(line, {"line": line, "state": value.state.value})
