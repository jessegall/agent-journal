from argparse import ArgumentParser, Namespace

from core.modules.tasks.models.task import Task
from engine.caller.caller import Caller
from engine.command.command import Command
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.start_next_worker_task.start_next_worker_task import StartNextWorkerTask
from suites.coding.modules.workers.commands.support.worker_command_request import WorkerCommandRequest
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.support.worker_run_answer import WorkerRunAnswer

NEXT_TEXT = "started task {task}; nothing was committed or tested: journal worker commit does that"


class StartNextWorkerTaskSubcommand(Subcommand[Command[object], Task]):
    """`journal worker next`: starts the next task the worker may start, beside the tasks it has started. It
    commits, judges and tests nothing, and says so: journal worker commit does that."""

    cli_name = "worker"
    name = "next"
    outward = True

    def __init__(self, requests: WorkerCommandRequest, guidance: WorkerGuidance, run_answer: WorkerRunAnswer) -> None:
        self.requests, self.guidance, self.run_answer = requests, guidance, run_answer

    def arguments(self, parser: ArgumentParser) -> None:
        WorkerCommandRequest.arguments(parser)

    def command(self, arguments: Namespace, caller: Caller) -> Command[object]:
        return self.requests.command(StartNextWorkerTask(), caller.actor.id, ["worker", "next"], arguments, caller)

    def write_output(self, value: object, output: Output) -> None:
        if self.run_answer.write(value, output):
            return
        if isinstance(value, Task):
            output.line(NEXT_TEXT.format(task=value.id))
            output.line(self.guidance.task_line(value))
