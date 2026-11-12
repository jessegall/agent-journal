from argparse import Namespace

from engine.caller.caller import Caller
from engine.query.queries import Queries
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.types.type_guards import is_tuple
from suites.coding.modules.workers.models.worker_wait import WorkerWait

WORKER_WAITS_REASON = "the list shows what every worker waits on"


class WorkerWaitsSubcommand(ReadSubcommand[tuple[WorkerWait, ...]]):
    cli_name = "worker"
    name = "waits"
    environment_refusal = "the workers are shown for one environment"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def read(self, arguments: Namespace, caller: Caller) -> tuple[WorkerWait, ...]:
        rows = self.queries.query(WorkerWait).every_row(WORKER_WAITS_REASON)
        return tuple(rows)

    def write_output(self, value: object, output: Output) -> None:
        if is_tuple(value):
            rows = [row for row in value if isinstance(row, WorkerWait)]
            output.write("\n".join(f"{row.agent_id}  {row.reason}" for row in rows), {"rows": [row.json() for row in rows]})
