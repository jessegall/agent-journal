from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from suites.coding.commands.record_file_changes.record_file_changes import RecordFileChanges


class RecordFileChangesSubcommand(Subcommand[RecordFileChanges, None]):
    """`journal file-edit record-changes <report>`: the file scan reports what changed, for the agent of a
    process or of a session."""

    cli_name = "file-edit"
    name = "record-changes"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("report_path")
        parser.add_argument("--process", type=int, dest="process_id")
        parser.add_argument("--session", default="")

    def command(self, arguments: Namespace, caller: Caller) -> RecordFileChanges:
        return RecordFileChanges(arguments.report_path, arguments.process_id, arguments.session)
