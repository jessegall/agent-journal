from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.library.commands.run_library_sync.run_library_sync import RunLibrarySync
from core.modules.library.support.sync_outcome import SyncOutcome


class RunLibrarySyncSubcommand(Subcommand[RunLibrarySync, SyncOutcome]):
    """`journal library sync`: runs one sync round now and prints what happened."""

    cli_name = "library"
    name = "sync"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def command(self, arguments: Namespace, caller: Caller) -> RunLibrarySync:
        return RunLibrarySync()

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, SyncOutcome):
            output.write(value.line, {"line": value.line, "has_reached": value.has_reached, "has_changed": value.has_changed})
