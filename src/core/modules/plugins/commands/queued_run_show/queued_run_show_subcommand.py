from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.query.queries import Queries
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.plugins.models.queued_run import QueuedRun
from core.modules.plugins.support.queued_run_output import render_queued_run


class QueuedRunShowSubcommand(ReadSubcommand[QueuedRun]):
    """`journal plugin queue-show <run>`: whether a queued run is waiting, running, ended, timed-out or cancelled,
    with its exit code and how long it ran once it is over."""

    cli_name = "plugin"
    name = "queue-show"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("run", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> QueuedRun:
        return self.queries.query(QueuedRun).find(arguments.run)

    def write_output(self, value: object, output: Output) -> None:
        render_queued_run(value, output)
