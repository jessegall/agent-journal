from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.command.command import Command
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.update_worker.update_worker import UpdateWorker
from suites.coding.modules.workers.support.update_outcome import UpdateOutcome
from suites.coding.modules.workers.support.worker_command_request import WorkerCommandRequest
from suites.coding.modules.workers.support.worker_run_answer import WorkerRunAnswer


class UpdateWorkerSubcommand(Subcommand[Command[object], UpdateOutcome]):
    """`journal worker update`: brings the worker's worktree up to the base branch it was cut from, keeping its
    uncommitted changes; queued behind a command of the worker that still runs."""

    cli_name = "worker"
    name = "update"
    outward = True

    def __init__(self, requests: WorkerCommandRequest, run_answer: WorkerRunAnswer) -> None:
        self.requests, self.run_answer = requests, run_answer

    def arguments(self, parser: ArgumentParser) -> None:
        WorkerCommandRequest.arguments(parser)

    def command(self, arguments: Namespace, caller: Caller) -> Command[object]:
        return self.requests.command(UpdateWorker(caller.process_id), caller.actor.id, ["worker", self.name], arguments, caller)

    def write_output(self, value: object, output: Output) -> None:
        if self.run_answer.write(value, output):
            return
        if isinstance(value, UpdateOutcome):
            for line in value.lines():
                output.line(line)
