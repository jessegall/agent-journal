from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from suites.coding.modules.workers.models.worker_points import WorkerPoints
from suites.coding.modules.workers.support.worker_point_list import WorkerPointList


class WorkerPointsSubcommand(ReadSubcommand[WorkerPointList]):
    """`journal worker-worktree points --agent <n>`: the points of the brief of the agent's newest worktree's
    task, each with the proof shown for it."""

    cli_name = "worker-worktree"
    name = "points"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--agent", type=int, required=True)

    def read(self, arguments: Namespace, caller: Caller) -> WorkerPointList:
        return WorkerPointList(self.queries.query(WorkerPoints).filter(session_agent_id=arguments.agent).descending("worktree_id").first())

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, WorkerPointList):
            output.write(f"{len(value.points())} points", value.json())
