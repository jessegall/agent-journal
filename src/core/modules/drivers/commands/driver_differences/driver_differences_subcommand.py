from argparse import Namespace
from collections import Counter

from engine.caller.caller import Caller
from engine.query.queries import Queries
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.drivers.models.driver_comparison import DriverComparison

DIFFERENCES_REASON = "the kinds of difference are few: one per intended difference of the design and the unexplained rest"


class DriverDifferencesSubcommand(ReadSubcommand[tuple[str, ...]]):
    """`journal driver differences`: each kind of difference between the old and the new answers, how it
    stands, and how often it was seen."""

    cli_name = "driver"
    name = "differences"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def read(self, arguments: Namespace, caller: Caller) -> tuple[str, ...]:
        counts = Counter((row.difference_key or "unexplained", row.difference_state.value) for row in self.queries.query(DriverComparison).every_row(DIFFERENCES_REASON))
        return tuple(f"{key} {state}: seen {count} times" for (key, state), count in sorted(counts.items())) or tuple(["no difference seen yet"])
