from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.support.output_access import OutputAccess
from core.modules.processes.support.output_page import OutputPage
from core.modules.processes.support.output_folder import OutputFolder

PAGE_LINES = 300


class PageOutputSubcommand(ReadSubcommand[OutputPage]):
    """`journal output page <n> [--before B] [--after A] [--limit K]`: some lines of what a run printed, the newest
    by default, those ending at byte B, or those new since byte A; the windows read an output this way."""

    cli_name = "output"
    name = "page"

    def __init__(self, access: OutputAccess, folder: OutputFolder) -> None:
        self.access, self.folder = access, folder

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("process_id", type=int)
        parser.add_argument("--before", type=int, default=-1)
        parser.add_argument("--after", type=int, default=-1)
        parser.add_argument("--limit", type=int, default=PAGE_LINES)

    def read(self, arguments: Namespace, caller: Caller) -> OutputPage:
        process = self.access.process(caller.actor, arguments.process_id)
        if arguments.after >= 0:
            return self.folder.page_after(process.id, arguments.after, process.state not in RUNNING_STATES)
        return self.folder.older_page(process.id, arguments.before, arguments.limit)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, OutputPage):
            value.write(output)
