from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.registry.registry import Registry
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.type_guards import is_tuple
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
        totals = {total.nudge_key: total for total in self.queries.query(NudgeTotal).full_table(TOTALS_REASON).all_rows()}
        return tuple(NudgeRow(entry.key, entry.module, entry.type, entry.text, entry.repeat_seconds, totals[entry.key].delivery_count if entry.key in totals else 0,
                              totals[entry.key].last_delivered_at if entry.key in totals else "") for entry in self.registry.nudges)

    def write_output(self, value: object, output: Output) -> None:
        if is_tuple(value):
            rows = [row for row in value if isinstance(row, NudgeRow)]
            output.write("\n".join(f"{row.key}: {row.type}, said {row.delivery_count} times" for row in rows), {"rows": [row.json() for row in rows]})
