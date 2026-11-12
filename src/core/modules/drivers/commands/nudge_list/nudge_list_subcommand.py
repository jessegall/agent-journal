from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.query.queries import Queries
from engine.registry.registry import Registry
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.types.type_guards import is_tuple
from core.modules.drivers.models.nudge_total import NudgeTotal
from core.modules.drivers.support.nudge_row import NudgeRow

TOTALS_REASON = "One total for each nudge the code declares, never for stored journal rows."


class NudgeListSubcommand(ReadSubcommand[tuple[NudgeRow, ...]]):
    """`journal nudge list`: every nudge the modules declare, its type and words, and how often it was said.
    """

    cli_name = "nudge"
    name = "list"

    def __init__(self, registry: Registry, queries: Queries) -> None:
        self.registry, self.queries = registry, queries

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> tuple[NudgeRow, ...]:
        totals = {total.nudge_key: total for total in self.queries.query(NudgeTotal).every_row(TOTALS_REASON)}
        return tuple(NudgeRow(entry.key, entry.module, entry.type, entry.text, entry.repeat_seconds, totals[entry.key].delivery_count if entry.key in totals else 0,
                              totals[entry.key].last_delivered_at if entry.key in totals else "") for entry in self.registry.nudges)

    def write_output(self, value: object, output: Output) -> None:
        if is_tuple(value):
            rows = [row for row in value if isinstance(row, NudgeRow)]
            output.write("\n".join(f"{row.key}: {row.type}, said {row.delivery_count} times" for row in rows), {"rows": [row.json() for row in rows]})
