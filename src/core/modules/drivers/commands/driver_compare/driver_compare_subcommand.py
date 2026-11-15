from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.query.queries import Queries
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.drivers.models.driver_comparison import DriverComparison
from core.modules.drivers.models.enums.difference_state import DifferenceState

COMPARISONS_SHOWN = 50


class DriverCompareSubcommand(ReadSubcommand[tuple[str, ...]]):
    """`journal driver compare [--slice <slice>]`: the newest events whose old and new answers differ in a way
    nobody explained, each with both answers."""

    cli_name = "driver"
    name = "compare"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--slice", default="")

    def read(self, arguments: Namespace, caller: Caller) -> tuple[str, ...]:
        query = self.queries.query(DriverComparison).filter(difference_state=DifferenceState.UNEXPLAINED)
        rows = (query.filter(slice_name=arguments.slice) if arguments.slice else query).newest().page(1, COMPARISONS_SHOWN).rows
        lines = tuple(f"agent {row.session_agent_id} {row.slice_name}: old {row.old_answer} new {row.new_answer}" for row in rows)
        return lines or tuple(["no unexplained difference"])
