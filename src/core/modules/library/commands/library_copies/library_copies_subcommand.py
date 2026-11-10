from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.library.models.enums.copy_progress import CopyProgress
from core.modules.library.support.copy_statuses import CopyStatuses
from core.modules.library.support.library_copies import LibraryCopies


class LibraryCopiesSubcommand(ReadSubcommand[LibraryCopies]):
    """`journal library copies [--state s]`: the local rows that follow an item, each with its status; --state keeps
    those with one status."""

    cli_name = "library"
    name = "copies"

    def __init__(self, statuses: CopyStatuses) -> None:
        self.statuses = statuses

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--state", choices=[progress.value for progress in CopyProgress], default="")

    def read(self, arguments: Namespace, caller: Caller) -> LibraryCopies:
        return LibraryCopies(tuple(status for status in self.statuses.all_statuses() if not arguments.state or status.progress.value == arguments.state))
