from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.agent_number import AgentNumber
from engine.errors.refusal import Refusal
from core.modules.agents.support.agent_rows import AgentRows
from suites.coding.modules.workers.commands.decide_behind_check.order_worker_update import OrderWorkerUpdate
from engine.command.command import Command
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.update_worker.update_worker import UpdateWorker
from suites.coding.modules.workers.support.update_outcome import UpdateOutcome
from suites.coding.modules.workers.commands.support.worker_command_request import WorkerCommandRequest
from suites.coding.modules.workers.support.worker_run_answer import WorkerRunAnswer

WORKER_WORKTREE_RULE = "a worker updates only its own worktree"
MAIN_AGENT_ORDER = "the main agent orders the update"


class UpdateWorkerSubcommand(Subcommand[Command[object], UpdateOutcome]):
    """`journal worker update`: brings the worker's worktree up to the base branch it was cut from, keeping
    its uncommitted changes; queued behind a command of the worker that still runs. The main agent names a
    worker to order its update as the merger does; a worker updates only its own worktree."""

    cli_name = "worker"
    name = "update"
    outward = True

    def __init__(self, requests: WorkerCommandRequest, run_answer: WorkerRunAnswer, agents: AgentRows) -> None:
        self.requests, self.run_answer, self.agents = requests, run_answer, agents

    def arguments(self, parser: ArgumentParser) -> None:
        WorkerCommandRequest.arguments(parser)
        parser.add_argument("worker_id", type=AgentNumber, nargs="?", help="the main agent orders this worker to update")

    def command(self, arguments: Namespace, caller: Caller) -> Command[object]:
        matching = arguments.worker_id
        if matching is None or matching == caller.actor.id:
            return self.requests.command(UpdateWorker(caller.process_id), caller.actor.id, ["worker", self.name], arguments, caller)
        if not self.agents.is_main(caller.actor.id):
            raise Refusal(WORKER_WORKTREE_RULE, "run journal worker update with no worker to update your own")
        return OrderWorkerUpdate(matching, MAIN_AGENT_ORDER)

    def write_output(self, value: object, output: Output) -> None:
        if self.run_answer.write(value, output):
            return
        if isinstance(value, UpdateOutcome):
            for line in value.lines():
                output.line(line)
