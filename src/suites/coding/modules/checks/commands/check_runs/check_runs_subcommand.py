from engine.database.row_history import RowHistory
from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.event.event_log import EventLog
from engine.query.queries import Queries
from engine.subcommand.read_subcommand import ReadSubcommand
from suites.coding.modules.checks.models.check import Check
from suites.coding.modules.checks.support.check_run_history import CheckRunHistory

CHECKS_TABLE = "checks"


class CheckRunsSubcommand(ReadSubcommand[CheckRunHistory]):
    """`journal check runs <n>`: when a check ran, whether each run passed and what it printed."""

    cli_name = "check"
    name = "runs"

    def __init__(self, events: EventLog, queries: Queries) -> None:
        self.events, self.queries = events, queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> CheckRunHistory:
        return CheckRunHistory.built(self.events.newest_row_events(RowHistory(CHECKS_TABLE, arguments.id)), self.queries.query(Check).find(arguments.id))
