from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.query.queries import Queries
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.plugins.models.queued_run import QueuedRun
from core.modules.processes.support.output_folder import OutputFolder


class QueuedRunReadSubcommand(ReadSubcommand[list[str]]):
    """`journal plugin queue-read <run> [--tail N]`: what a queued run printed so far, or its last lines."""

    cli_name = "plugin"
    name = "queue-read"

    def __init__(self, queries: Queries, folder: OutputFolder) -> None:
        self.queries, self.folder = queries, folder

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("run", type=int)
        parser.add_argument("--tail", type=int, default=0)

    def read(self, arguments: Namespace, caller: Caller) -> list[str]:
        run = self.queries.query(QueuedRun).find(arguments.run)
        if arguments.tail > 0:
            return self.folder.last_lines(run.process_id, arguments.tail)
        return self.folder.all_output(run.process_id).splitlines()

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, list):
            output.write("\n".join(str(line) for line in value), {"lines": value})
