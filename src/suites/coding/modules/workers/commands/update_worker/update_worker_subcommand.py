from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.agent_id import AgentId
from engine.errors.refusal import Refusal
from core.modules.agents.support.agent_rows import AgentRows
from suites.coding.modules.workers.commands.decide_behind_check.order_worker_update import OrderWorkerUpdate
from engine.command.command import Command
from engine.subcommand.output import Output
from engine.subcommand.subcommand import SUCCESS_CODE, Subcommand
from suites.coding.modules.workers.commands.update_worker.update_worker import UpdateWorker
from suites.coding.modules.workers.models.enums.update_result import UpdateResult
from suites.coding.modules.workers.support.update_outcome import UpdateOutcome
from suites.coding.modules.workers.commands.support.worker_command_request import WorkerCommandRequest
from suites.coding.modules.workers.support.worker_run_answer import WorkerRunAnswer

WORKER_WORKTREE_RULE = "a worker updates only its own worktree"
MAIN_AGENT_ORDER = "the main agent orders the update"
CONFLICT_CODE = 1


class UpdateWorkerSubcommand(Subcommand[Command[object], UpdateOutcome]):
    """`journal worker update`: brings the worker's worktree up to the base branch it was cut from, keeping
    its uncommitted changes; queued behind a command of the worker that still runs. The main agent names a
    worker to order its update as the merger does; a worker updates only its own worktree."""

    cli_name = "worker"
    name = "update"
    external = True

    def __init__(self, requests: WorkerCommandRequest, run_answer: WorkerRunAnswer, agents: AgentRows) -> None:
        self.requests, self.run_answer, self.agents = requests, run_answer, agents

    def arguments(self, parser: ArgumentParser) -> None:
        WorkerCommandRequest.arguments(parser)
        parser.add_argument("worker_id", type=AgentId, nargs="?", help="the main agent orders this worker to update")

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

    # an update that stops on clashes ends the line with a code that is not 0
    def after_listeners(self, value: object, output: Output) -> int:
        return CONFLICT_CODE if isinstance(value, UpdateOutcome) and value.outcome is UpdateResult.CONFLICTS else SUCCESS_CODE
