from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.environment_names import EnvironmentNames
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.type_guards import is_tuple
from suites.coding.modules.workers.models.worker_wait import WorkerWait


class WorkerWaitsSubcommand(ReadSubcommand[tuple[WorkerWait, ...]]):
    cli_name = "worker"
    name = "waits"

    def __init__(self, queries: Queries, environments: EnvironmentNames) -> None:
        self.queries, self.environments = queries, environments

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")

    def read(self, arguments: Namespace, caller: Caller) -> tuple[WorkerWait, ...]:
        environment_id = self.environments.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        if environment_id is None:
            raise Refusal("the workers are shown for one environment", "name it with --environment")
        rows = self.queries.query(WorkerWait).filter(environment_id=environment_id).ordered("agent_id").all_rows()
        return tuple(rows)

    def write_output(self, value: object, output: Output) -> None:
        if is_tuple(value):
            rows = [row for row in value if isinstance(row, WorkerWait)]
            output.write("\n".join(f"{row.agent_id}  {row.reason}" for row in rows), {"rows": [row.json() for row in rows]})
