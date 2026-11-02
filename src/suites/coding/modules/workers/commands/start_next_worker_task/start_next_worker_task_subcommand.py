from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.start_next_worker_task.start_next_worker_task import StartNextWorkerTask


class StartNextWorkerTaskSubcommand(Subcommand[StartNextWorkerTask, Task]):
    """`journal worker next`: the worker's task is done, with a proof for every point of its brief; the next task in
    its queue starts and its brief is printed."""

    cli_name = "worker"
    name = "next"

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def command(self, arguments: Namespace, caller: Caller) -> StartNextWorkerTask:
        return StartNextWorkerTask()

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Task):
            output.line(f"your next task, task {value.id}: {value.title}\n{value.brief}")
