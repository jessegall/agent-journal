from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.query.conditions.among import Among
from engine.query.conditions.less import Less
from engine.query.queries import Queries
from engine.query.query import PAGE_SIZE_ROWS
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.dumps.models.dump import Dump
from core.modules.dumps.models.dump_item import DumpItem
from core.modules.dumps.support.dump_board import DumpBoard


class DumpBoardSubcommand(ReadSubcommand[DumpBoard]):
    """`journal dump board [--before <id>]`: a page of dumps, newest first and before the number given, each
    with its items in order."""

    cli_name = "dump"
    name = "board"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--before", type=int, default=0)

    def read(self, arguments: Namespace, caller: Caller) -> DumpBoard:
        dumps = self.queries.query(Dump)
        rows = (dumps.matching(Less("id", arguments.before)) if arguments.before else dumps).newest().limited(PAGE_SIZE_ROWS)
        items = self.queries.query(DumpItem).matching(Among("dump_id", tuple(dump.id for dump in rows))).ordered("dump_id", "position")
        return DumpBoard(dumps.count(), rows, tuple(items.all_rows()))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, DumpBoard):
            output.write(f"{value.total} dumps", value.json())
