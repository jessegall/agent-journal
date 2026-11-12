from argparse import ArgumentParser, Namespace
from collections.abc import Sequence

from engine.caller.caller import Caller
from engine.query.queries import Queries
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.types.type_guards import is_tuple
from core.modules.usage.models.statistic import Statistic

COUNTERS_REASON = "One number for each counter the code and the profiles name, never for stored journal rows."


class StatisticListSubcommand(ReadSubcommand[Sequence[Statistic]]):
    """`journal statistic list [--prefix <start of the key>]`: the project's counts by key."""

    cli_name = "statistic"
    name = "list"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--prefix", default="")

    def read(self, arguments: Namespace, caller: Caller) -> Sequence[Statistic]:
        return tuple(row for row in sorted(self.queries.query(Statistic).every_row(COUNTERS_REASON), key=lambda row: row.key) if row.key.startswith(arguments.prefix))

    def write_output(self, value: object, output: Output) -> None:
        listed = [row for row in value if isinstance(row, Statistic)] if is_tuple(value) else []
        output.write("\n".join(f"{row.key}  {row.value}" for row in listed) or "no counts yet", {"rows": [output.values(row) for row in listed]})
