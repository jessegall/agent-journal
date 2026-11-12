from core.modules.agents.conditions.kept_agent_rows import KeptAgentRows
from argparse import Namespace

from engine.caller.caller import Caller
from engine.query.queries import Queries
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.types.type_guards import is_tuple
from suites.coding.modules.workers.models.worker_progress import WorkerProgress

PROGRESS_REASON = "One row for each worker that is not retired, which the kept limit of workers bounds."


class WorkerProgressSubcommand(ReadSubcommand[tuple[WorkerProgress, ...]]):
    cli_name = "worker"
    name = "progress"
    environment_refusal = "worker progress is shown for one environment"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def read(self, arguments: Namespace, caller: Caller) -> tuple[WorkerProgress, ...]:
        return tuple(self.queries.query(WorkerProgress).matching(KeptAgentRows("agent_id")).every_row(PROGRESS_REASON))

    def write_output(self, value: object, output: Output) -> None:
        if is_tuple(value):
            rows = [row for row in value if isinstance(row, WorkerProgress)]
            output.write("\n".join(f"{row.agent_id}  {row.completed_count} of {row.task_count}" for row in rows), {"rows": [row.json() for row in rows]})
