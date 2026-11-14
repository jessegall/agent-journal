from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.query.queries import Queries
from engine.subcommand.output import Output
from engine.types.type_guards import is_list
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.dumps.models.dump import Dump
from core.modules.dumps.models.dump_item import DumpItem

DUMP_ITEMS_REASON = "the item list shows every item of the dump"


class DumpItemsSubcommand(ReadSubcommand[list[DumpItem]]):
    """`journal dump items <dump>`: each item of the dump with where it stands."""

    cli_name = "dump"
    name = "items"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("dump_id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> list[DumpItem]:
        dump = self.queries.query(Dump).find(arguments.dump_id)
        return list(self.queries.query(DumpItem).filter(dump_id=dump.id).every_row(DUMP_ITEMS_REASON))

    def write_output(self, value: object, output: Output) -> None:
        if is_list(value):
            for item in value:
                if isinstance(item, DumpItem):
                    output.line(item.line)
