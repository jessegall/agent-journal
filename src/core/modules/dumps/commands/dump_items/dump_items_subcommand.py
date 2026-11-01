from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.type_guards import is_list
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.dumps.models.dump import Dump
from core.modules.dumps.models.dump_item import DumpItem


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
        return list(self.queries.query(DumpItem).filter(dump_id=dump.id).oldest().all_rows())

    def write_output(self, value: object, output: Output) -> None:
        if is_list(value):
            for item in value:
                if isinstance(item, DumpItem):
                    output.line(item.line)
